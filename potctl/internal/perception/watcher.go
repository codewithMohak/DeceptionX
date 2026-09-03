package perception

import (
	"bufio"
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/codewithMohak/DeceptionX/potctl/internal/logging"
	"github.com/fsnotify/fsnotify"
)

// Watch function continues monitors the directory containing eve.json
func Watch(
	ctx context.Context,
	path string,
	out chan<- NormalizedEvent,
) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	defer watcher.Close()

	dir := filepath.Dir(path)

	if err := watcher.Add(dir); err != nil {
		return err
	}

	file, err := os.Open(path)
	if err != nil {
		return err
	}

	offset, err := file.Seek(0, 2)
	if err != nil {
		file.Close()
		return err
	}

	file.Close()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()

		case err := <-watcher.Errors:
			logging.Log.Error().Err(err).Msg("fsnotify watcher error")

		case event := <-watcher.Events:
			if event.Name != path {
				continue
			}

			if event.Op&(fsnotify.Write|fsnotify.Create) != 0 {
				newOffset, err := readNewLines(
					ctx,
					path,
					offset,
					out,
				)
				if err != nil {
					logging.Log.Error().Err(err).Msg("failed to read new eve.json events")
					continue
				}
				offset = newOffset
			}
			if event.Op&fsnotify.Remove != 0 {
				offset = 0
				time.Sleep(100 * time.Millisecond)
			}
		}
	}
}

// readNewLines reads eve,json starting from a previously saved offset.

func readNewLines(
	ctx context.Context,
	path string,
	offset int64,
	out chan<- NormalizedEvent,
) (int64, error) {
	file, err := os.Open(path)

	if err != nil {
		return offset, err
	}
	defer file.Close()

	if _, err := file.Seek(offset, 0); err != nil {
		return offset, err
	}

	scanner := bufio.NewScanner(file)

	scanner.Buffer(
		make([]byte, 64*1024),
		1024*1024,
	)

	for scanner.Scan() {
		event, err := ParseLine(scanner.Bytes())
		if err != nil {
			logging.Log.Warn().Err(err).Msg("skipping malformed eve,json line")
			continue
		}
		select {
		case out <- event:
		case <-ctx.Done():
			return offset, ctx.Err()
		}
	}

	if err := scanner.Err(); err != nil {
		return offset, err
	}

	currentOffset, err := file.Seek(0, 1)

	if err != nil {
		return offset, err
	}
	return currentOffset, nil
}

func fileOffsetAtEnd(path string) (int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	offset, err := file.Seek(0, 2)
	if err != nil {
		return 0, err
	}
	return offset, nil
}
