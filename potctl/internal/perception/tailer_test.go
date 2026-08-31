package perception

import (
	"context"
	"os"
	"path/filepath"
	"testing"
)

func TestTail(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "eve.json")

	data := `{"timestamp":"2026-08-25T10:00:00Z","event_type":"ssh","src_ip":"192.168.56.20","dest_port":22}
{"timestamp":"2026-08-25T10:00:01Z","event_type":"http","src_ip":"192.168.56.21","dest_port":80}
`

	if err := os.WriteFile(path, []byte(data), 0600); err != nil {
		t.Fatalf("failed to create test eve.json: %v", err)
	}

	out := make(chan NormalizedEvent, 2)

	err := Tail(context.Background(), path, out)
	if err != nil {
		t.Fatalf("Tail returned error: %v", err)
	}

	if len(out) != 2 {
		t.Fatalf("expected 2 events, got %d", len(out))
	}

	sshEvent := <-out

	if sshEvent.Service != "ssh" {
		t.Errorf("expected ssh service, got %s", sshEvent.Service)
	}

	httpEvent := <-out

	if httpEvent.Service != "http" {
		t.Errorf("expected http service, got %s", httpEvent.Service)
	}
}
