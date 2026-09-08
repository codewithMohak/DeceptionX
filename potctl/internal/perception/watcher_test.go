package perception

import (
	"context"
	"os"
	"path/filepath"
	"testing"
)

func TestFileOffsetAtEnd(t *testing.T) {
	// Create a temporary directory for this test.
	dir := t.TempDir()

	// Create the path for our temporary eve.json file.
	path := filepath.Join(dir, "eve.json")

	// Create sample file contents.
	data := []byte("first event\nsecond event\n")

	// Write the sample data to eve.json.
	if err := os.WriteFile(path, data, 0600); err != nil {
		t.Fatalf("failed to create test file: %v", err)
	}

	// Get the current byte offset at the end of the file.
	offset, err := fileOffsetAtEnd(path)
	if err != nil {
		t.Fatalf("fileOffsetAtEnd returned error: %v", err)
	}

	// The expected offset is the total number of bytes in the file.
	expected := int64(len(data))

	// Verify that the returned offset matches the file size.
	if offset != expected {
		t.Fatalf(
			"expected offset %d, got %d",
			expected,
			offset,
		)
	}
}

func TestPartialLineHandling(t *testing.T) {
	// Create a temporary directory for the test.
	dir := t.TempDir()

	// Create the temporary eve.json path.
	path := filepath.Join(dir, "eve.json")

	// Create an empty eve.json file.
	if err := os.WriteFile(path, []byte{}, 0600); err != nil {
		t.Fatalf("failed to create test file: %v", err)
	}

	// Create a buffered output channel.
	out := make(chan NormalizedEvent, 1)

	// Create a context for the test.
	ctx := context.Background()

	// Start with an empty tailing state.
	state := tailState{}

	// Write only part of a JSON event.
	partial := []byte(
		`{"timestamp":"2026-09-08T10:00:00Z","event_type":"ssh","src_ip":"192.168.`,
	)

	if err := os.WriteFile(path, partial, 0600); err != nil {
		t.Fatalf("failed to write partial event: %v", err)
	}

	// Read the newly written data.
	if err := readNewLines(ctx, path, &state, out); err != nil {
		t.Fatalf("readNewLines returned error: %v", err)
	}

	// The event must NOT be emitted because there is no newline yet.
	if len(out) != 0 {
		t.Fatalf(
			"expected no event for partial line, got %d",
			len(out),
		)
	}

	// Complete the JSON event and add the newline.
	remainder := []byte(
		`56.20","dest_port":22}` + "\n",
	)

	// Append the remaining bytes to the file.
	file, err := os.OpenFile(
		path,
		os.O_APPEND|os.O_WRONLY,
		0600,
	)
	if err != nil {
		t.Fatalf("failed to open file for append: %v", err)
	}

	if _, err := file.Write(remainder); err != nil {
		file.Close()
		t.Fatalf("failed to append remainder: %v", err)
	}

	// Close the file after writing.
	if err := file.Close(); err != nil {
		t.Fatalf("failed to close file: %v", err)
	}

	// Read the newly appended data.
	if err := readNewLines(ctx, path, &state, out); err != nil {
		t.Fatalf("readNewLines returned error: %v", err)
	}

	// Exactly one complete event should now exist.
	if len(out) != 1 {
		t.Fatalf(
			"expected exactly one event, got %d",
			len(out),
		)
	}

	// Read the normalized event.
	event := <-out

	// Verify that the event was correctly parsed.
	if event.Service != "ssh" {
		t.Errorf(
			"expected service ssh, got %s",
			event.Service,
		)
	}

	// Verify the source IP was reconstructed correctly.
	if event.SrcIP != "192.168.56.20" {
		t.Errorf(
			"expected source IP 192.168.56.20, got %s",
			event.SrcIP,
		)
	}
}

func TestFileRotation(t *testing.T) {
	// Create a temporary directory for the test.
	dir := t.TempDir()

	// Define the path of eve.json.
	path := filepath.Join(dir, "eve.json")

	// Create the initial eve.json file.
	initialData := []byte(
		`{"timestamp":"2026-09-08T10:00:00Z","event_type":"ssh","src_ip":"192.168.1.10","dest_port":22}` + "\n",
	)

	if err := os.WriteFile(path, initialData, 0600); err != nil {
		t.Fatalf("failed to create eve.json: %v", err)
	}

	// Start at the end of the existing file.
	offset, err := fileOffsetAtEnd(path)
	if err != nil {
		t.Fatalf("fileOffsetAtEnd returned error: %v", err)
	}

	// Create the tailing state.
	state := tailState{
		offset: offset,
	}

	// Create an output channel.
	out := make(chan NormalizedEvent, 2)

	// Create a context for the test.
	ctx := context.Background()

	// Rename the existing file to simulate rotation.
	rotatedPath := filepath.Join(dir, "eve.json.1")

	if err := os.Rename(path, rotatedPath); err != nil {
		t.Fatalf("failed to rotate eve.json: %v", err)
	}

	// Simulate the Remove event from fsnotify.
	state.offset = 0
	state.pending = nil

	// Recreate eve.json.
	newData := []byte(
		`{"timestamp":"2026-09-08T10:00:01Z","event_type":"http","src_ip":"192.168.1.20","dest_port":80}` + "\n",
	)

	if err := os.WriteFile(path, newData, 0600); err != nil {
		t.Fatalf("failed to recreate eve.json: %v", err)
	}

	// Read the new file from the beginning.
	if err := readNewLines(ctx, path, &state, out); err != nil {
		t.Fatalf("readNewLines returned error: %v", err)
	}

	// Exactly one event should have been processed.
	if len(out) != 1 {
		t.Fatalf(
			"expected exactly one event after rotation, got %d",
			len(out),
		)
	}

	// Read the event.
	event := <-out

	// Verify that the new file's event was processed.
	if event.Service != "http" {
		t.Errorf(
			"expected service http, got %s",
			event.Service,
		)
	}

	// Verify that the new source IP was processed.
	if event.SrcIP != "192.168.1.20" {
		t.Errorf(
			"expected source IP 192.168.1.20, got %s",
			event.SrcIP,
		)
	}
}
