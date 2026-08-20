package main

import (
	"net/http"
	"os"
	"time"

	"github.com/codewithMohak/DeceptionX/potctl/internal/api"
	"github.com/codewithMohak/DeceptionX/potctl/internal/banner"
	"github.com/codewithMohak/DeceptionX/potctl/internal/docker"
	"github.com/codewithMohak/DeceptionX/potctl/internal/logging"
	"github.com/codewithMohak/DeceptionX/potctl/internal/storage"
)

func main() {
	// logging.Init()
	banner.Print()
	dockerClient, err := docker.New()
	if err != nil {
		logging.Log.Fatal().Err(err).Msg("failed to initalize Docker")
	}
	banner.Success("Docker initialized")

	dbPath := os.Getenv("POTCTL_DB_PATH")
	if dbPath == "" {
		dbPath = "/var/lib/potctl/potctl.db"
	}

	store, err := storage.New(dbPath)
	if err != nil {
		logging.Log.Fatal().
			Err(err).
			Str("path", dbPath).
			Msg("failed to initialize storage")
	}
	banner.Success("Storage initialized")

	defer store.Close()

	apiKey := os.Getenv("POTCTL_API_KEY")
	if apiKey == "" {
		logging.Log.Fatal().Msg("POTCTL_API_KEY is not comfigured")
	}
	banner.Success("API authentication configured")

	srv := api.NewServer(
		dockerClient,
		store,
		logging.Log,
		apiKey,
	)
	banner.Success("API server initialized")
	
	server := &http.Server{
		Addr:              "127.0.0.1:8081",
		Handler:           srv.Router(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	logging.Log.Info().Str("action", "api.start").Str("target", "potctl-api").Str("reason", "service startup").Str("actor", "potctl").Str("result", "success").Msg("REST API started")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logging.Log.Fatal().Err(err).Msg("REST API failed")
	}
}
