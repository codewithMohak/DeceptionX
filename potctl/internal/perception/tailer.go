package perception

import (
	"bufio"
	"context"
	"encoding/json"
	"os"

	"github.com/codewithMohak/DeceptionX/potctl/internal/logging"
)

type RawAlert struct {
	Timestamp string          `json:"timestamp"`
	EventType string          `json:"event_type"`
	SrcIP     string          `json:"src_ip"`
	DestPort  int             `json:"dest_port"`
	Alert     json.RawMessage `json:"alert,omitempty"`
	HTTP      json.RawMessage `json:"http,omitempty"`
	SSH       json.RawMessage `json:"ssh,omitempty"`
}

type NormalizedEvent struct {
	Timestamp string `json:"timestamp"`
	SrcIP     string `json:"src_ip"`
	Service   string `json:"service"`
	Summary   string `json:"summary"`
}

func normailze(raw RawAlert) NormalizedEvent {
	return NormalizedEvent{
		Timestamp: raw.Timestamp,
		SrcIP:     raw.SrcIP,
		Service:   inferService(raw),
		Summary:   buildSummary(raw),
	}
}

// Tail read eve,json and sends normalized events to the output channel.

func Tail(ctx context.Context, path string, out chan<- NormalizedEvent) error {
	//File Opening
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	// Scanner
	scanner := bufio.NewScanner(file)
	scanner.Buffer(
		make([]byte, 64*1024),
		1024*1024,
	)

	for scanner.Scan() {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		// Line Processing
		event, err := ParseLine(scanner.Bytes())
		if err != nil {
			logging.Log.Warn().Err(err).Msg("skipping malformed eve.json line")
			continue
		}

		select {
		case out <- event:
		case <-ctx.Done():
			return ctx.Err()
		}
	}

	// Scanner Error Handling
	if err := scanner.Err(); err != nil {
		logging.Log.Error().Err(err).Msg("eve.json scanner error")
		return err
	}
	return nil
}
