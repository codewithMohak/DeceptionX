package perception

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFileOffsetAtEnd(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "eve.json")

	data := []byte("first event\nsecond event\n")

	if err := os.WriteFile(path, data, 0600); err != nil {
		t.Fatalf("failed to create test file: %v", err)
	}

	offset, err := fileOffsetAtEnd(path)
	if err != nil {
		t.Fatalf("fileOffsetAtEnd returned error: %v", err)
	}

	expected := int64(len(data))

	if offset != expected {
		t.Fatalf(
			"expected offset %d, got %d",
			expected,
			offset,
		)
	}
}
