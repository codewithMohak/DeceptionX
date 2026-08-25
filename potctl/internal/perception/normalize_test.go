package perception

import "testing"

func TestParseLine(t *testing.T) {
	line := []byte(`{
		"timestamp": "2026-08-25T10:00:00.000000+0000",
		"event_type": "ssh",
		"src_ip": "192.168.56.20",
		"dest_port": 22
	}`)

	event, err := ParseLine(line)
	if err != nil {
		t.Fatalf("ParseLine returned error: %v", err)
	}

	if event.SrcIP != "192.168.56.20" {
		t.Errorf("unexpected source IP: %s", event.SrcIP)
	}

	if event.Service != "ssh" {
		t.Errorf("expected ssh service, got %s", event.Service)
	}

	if event.Summary != "SSH activity observed" {
		t.Errorf("unexpected summary: %s", event.Summary)
	}
}

func TestParseMalformedLine(t *testing.T) {
	line := []byte(`{"event_type": "ssh"`)

	_, err := ParseLine(line)
	if err == nil {
		t.Fatal("expected malformed JSON to return an error")
	}
}
