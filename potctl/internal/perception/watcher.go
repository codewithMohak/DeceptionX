package perception

import (
	"bytes"
	"context"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/codewithMohak/DeceptionX/potctl/internal/logging"
	"github.com/fsnotify/fsnotify"
)

// tailState keeps track of how much of eve.json we have already read
// and stores an incomplete line until the next write completes it.
type tailState struct {
	// offset is the position in the file where the next read starts.
	offset int64

	// pending stores a JSON line that does not have a newline yet.
	pending []byte
}

// Watch continuously monitors the directory containing eve.json.
func Watch(
	ctx context.Context,
	path string,
	out chan<- NormalizedEvent,
) error {
	// Create a new filesystem watcher.
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	// Close the watcher when Watch returns.
	defer watcher.Close()

	// Get the directory containing eve.json.
	dir := filepath.Dir(path)

	// Watch the directory rather than only the file.
	// This allows us to detect file rotation/recreation.
	if err := watcher.Add(dir); err != nil {
		return err
	}

	// Open eve.json so we can find its current size.
	file, err := os.Open(path)
	if err != nil {
		return err
	}

	// Move to the end of the file.
	offset, err := file.Seek(0, 2)
	if err != nil {
		file.Close()
		return err
	}

	// Close the file after getting its size.
	file.Close()

	// Create the persistent tailing state.
	state := tailState{
		offset: offset,
	}

	// Wait for filesystem events until the context is cancelled.
	for {
		select {

		// Stop the watcher when the context is cancelled.
		case <-ctx.Done():
			return ctx.Err()

		// Handle errors reported by fsnotify.
		case err := <-watcher.Errors:
			logging.Log.Error().
				Err(err).
				Msg("fsnotify watcher error")

		// Handle filesystem events.
		case event := <-watcher.Events:

			// Ignore events for files other than eve.json.
			if event.Name != path {
				continue
			}

			// A Write means new data may have been appended.
			// Create handles a newly recreated eve.json.
			if event.Op&(fsnotify.Write|fsnotify.Create) != 0 {

				// Read the new data using our persistent tail state.
				err := readNewLines(
					ctx,
					path,
					&state,
					out,
				)

				// Log the error but keep the watcher alive.
				if err != nil {
					logging.Log.Error().
						Err(err).
						Msg("failed to read new eve.json events")
				}
			}

			// A Remove usually means the file was rotated or deleted.
			if event.Op&fsnotify.Remove != 0 {

				// Start reading from the beginning when the new file appears.
				state.offset = 0

				// Discard incomplete data belonging to the old file.
				state.pending = nil

				// Give the logging process a short moment to recreate the file.
				time.Sleep(100 * time.Millisecond)
			}
		}
	}
}

// readNewLines reads newly appended data from eve.json.
//
// It keeps incomplete lines in state.pending until a newline arrives.
func readNewLines(
	ctx context.Context,
	path string,
	state *tailState,
	out chan<- NormalizedEvent,
) error {
	// Open eve.json.
	file, err := os.Open(path)
	if err != nil {
		return err
	}

	// Close the file when this function returns.
	defer file.Close()

	// Get the current file size to detect truncation.
	info, err := file.Stat()
	if err != nil {
		return err
	}

	// Detect file truncation.
	if info.Size() < state.offset {
		// Restart reading from the beginning.
		state.offset = 0

		// Clear any incomplete data from the old file.
		state.pending = nil
	}

	// Move to the position where our previous read stopped.
	if _, err := file.Seek(state.offset, 0); err != nil {
		return err
	}

	// Read all newly appended bytes.
	data, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	// Advance the offset by the number of bytes read.
	state.offset += int64(len(data))

	// Add the new data to any incomplete line from the previous event.
	state.pending = append(state.pending, data...)

	// Process complete lines.
	for {
		// Search for a newline.
		index := bytes.IndexByte(state.pending, '\n')

		// No newline means the current line is incomplete.
		if index == -1 {

			// Prevent an attacker-controlled line from
			// consuming unlimited memory.
			if len(state.pending) > 1024*1024 {
				logging.Log.Warn().
					Msg("discarding oversized incomplete eve.json line")

				// Drop the oversized incomplete line.
				state.pending = nil
			}

			// Wait for the next filesystem event.
			return nil
		}

		// Extract the complete line without '\n'.
		line := state.pending[:index]

		// Remove the processed line and newline.
		state.pending = state.pending[index+1:]

		// Ignore empty lines.
		if len(line) == 0 {
			continue
		}

		// Parse and normalize the JSON event.
		event, err := ParseLine(line)
		if err != nil {
			// Malformed events must not terminate the watcher.
			logging.Log.Warn().
				Err(err).
				Msg("skipping malformed eve.json line")

			continue
		}

		// Send the normalized event to the next stage.
		select {
		case out <- event:
			// Event successfully delivered.

		case <-ctx.Done():
			// Stop immediately if the service is shutting down.
			return ctx.Err()
		}
	}
}

// fileOffsetAtEnd returns the current size of the file in bytes.
// We use this when starting the watcher so existing historical
// events are not processed again.
func fileOffsetAtEnd(path string) (int64, error) {
	// Open the file for reading.
	file, err := os.Open(path)
	if err != nil {
		return 0, err
	}

	// Close the file when this function returns.
	defer file.Close()

	// Move the file cursor to the end of the file.
	offset, err := file.Seek(0, 2)
	if err != nil {
		return 0, err
	}

	// Return the byte position at the end of the file.
	return offset, nil
}
