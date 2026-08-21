package api

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"net/http"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/rs/zerolog"
)

type DockerController interface {
	StartContainer(ctx context.Context, name string) error
	StopContainer(ctx context.Context, name string) error
	ListContainers(ctx context.Context) ([]container.Summary, error)
}

type ActionStore interface {
	RecordAction(
		actionType string,
		target string,
		actor string,
		reason string,
		result string,
	) error
}

type Server struct {
	docker  DockerController
	store   ActionStore
	logger  zerolog.Logger
	apiKey  []byte
	allowed map[string]struct{}
	limiter *RateLimiter
}

func NewServer(
	docker DockerController,
	store ActionStore,
	logger zerolog.Logger,
	apikey string,
) *Server {
	return &Server{
		docker: docker,
		store:  store,
		logger: logger,
		apiKey: []byte(apikey),
		allowed: map[string]struct{}{
			"cowrie":     {},
			"http-decoy": {},
		},
		limiter: NewRateLimiter(10, time.Minute),
	}
}

func (s *Server) authenticate(r *http.Request) bool {
	gotKey := r.Header.Get("X-API-Key")
	if gotKey == "" || len(s.apiKey) == 0 {
		return false
	}
	return subtle.ConstantTimeCompare(
		[]byte(gotKey),
		s.apiKey,
	) == 1
}

// State Handling

func (s *Server) handleState(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if !s.authenticate(r) {
		s.logRejected("state.read", "Unauthorized request")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	container, err := s.docker.ListContainers(r.Context())
	if err != nil {
		s.logFailure(
			"container.list",
			"*",
			"state request via REST API",
			err,
		)
		http.Error(w, "failed to retrieve state", http.StatusInternalServerError)
	}

	type containerState struct {
		ID     string `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}

	result := make([]containerState, 0, len(container))

	for _, c := range container {
		name := ""

		if len(c.Names) > 0 {
			name = c.Names[0]
		}
		result = append(result, containerState{
			ID:     c.ID,
			Name:   name,
			Status: c.Status,
		})
	}
	writeJSON(w, http.StatusOK, result)

	s.logger.Info().Str("action", "container.list").Str("target", "*").Str("reason", "state requested via REST API").Str("actor", "potctl-api").Str("result", "success").Msg("container state retrieved")
}

// toggle
type toggleRequest struct {
	Target string `json:"target"`
	Action string `json:"action"`
	Reason string `json:"reason"`
}

func (s *Server) handleToggle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusUnauthorized)
		return
	}
	if !s.authenticate(r) {
		s.logRejected("container.toggle", "unauthorized request")
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	if !s.limiter.Allow() {
		s.logRejected("container.toggle", "rate limit exceeded")
		http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 4096)

	var req toggleRequest
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&req); err != nil {
		s.logRejected("container.toggle", "invalid JSON request")
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.Target == "" || req.Action == "" || req.Reason == "" {
		s.logRejected("container.toggle", "missing required field")
		http.Error(w, "target, action and reason are required", http.StatusBadRequest)
		return
	}

	if _, ok := s.allowed[req.Target]; !ok {
		s.logRejected("container.toggle", "target not allow-listed")
		http.Error(w, "target not allowed", http.StatusForbidden)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var err error

	switch req.Action {
	case "start":
		err = s.docker.StartContainer(ctx, req.Target)

	case "stop":
		err = s.docker.StopContainer(ctx, req.Target)

	default:
		http.Error(w, "unsupported action", http.StatusBadRequest)
		return
	}

	if err != nil {
		s.logFailure("container."+req.Action, req.Target, req.Reason, err)
		_ = s.store.RecordAction("container."+req.Action, req.Target, "potctl-api", req.Reason, "Failure")
		http.Error(w, "container action failed", http.StatusInternalServerError)
		return
	}

	if err := s.store.RecordAction("container."+req.Action, req.Target, "potctl-api", req.Reason, "Success"); err != nil {
		http.Error(w, "action complteted but audit recording failed", http.StatusInternalServerError)
		return
	}

	s.logger.Info().Str("action", "container."+req.Action).Str("target", req.Target).Str("reason", req.Reason).Str("actor", "potctl-api").Str("result", "success").Msg("container action executed")

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "success",
		"target": req.Target,
		"action": req.Action,
	})
}

//logging helper function

func (s *Server) logRejected(action, reason string) {
	s.logger.Warn().Str("action", action).Str("target", "*").Str("reason", reason).Str("actor", "potctl-api").Str("result", "rejected").Msg("control plane request rejected")
}

// logFailure

func (s *Server) logFailure(
	action,
	target,
	reason string,
	err error,
) {
	s.logger.Error().Err(err).Str("action", action).Str("target", target).Str("reason", reason).Str("actor", "potctl-api").Str("result", "failure").Msg("control plane action failed")
}

//JSON response helper

func writeJSON(w http.ResponseWriter, status int, value interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

//traffic routing

func (s *Server) Router() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/state", s.handleState)
	mux.HandleFunc("/toggle", s.handleToggle)
	return mux
}
