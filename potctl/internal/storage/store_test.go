package storage

import (
	"path/filepath"
	"testing"
)

func TestRecordAction(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	store, err := New(dbPath)
	if err != nil {
		t.Fatalf("failed to create store: %v", err)
	}
	defer store.db.Close()

	err = store.RecordAction(
		"container.start",
		"cowrie",
		"potctl-test",
		"unit test",
		"success",
	)
	if err != nil {
		t.Fatalf("failed to record action: %v", err)
	}
}

func TestActionIsAppendOnly(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	store, err := New(dbPath)
	if err != nil {
		t.Fatalf("failed to create store: %v", err)
	}
	defer store.db.Close()

	err = store.RecordAction(
		"container.stop",
		"http-decoy",
		"potctl-test",
		"unit test",
		"success",
	)
	if err != nil {
		t.Fatalf("failed to record action: %v", err)
	}

	_, err = store.db.Exec(
		`UPDATE action SET result = ? WHERE id = ?`,
		"tampered",
		1,
	)
	if err == nil {
		t.Fatal("expected UPDATE to be rejected")
	}

	_, err = store.db.Exec(
		`DELETE FROM action WHERE id = ?`,
		1,
	)
	if err == nil {
		t.Fatal("expected DELETE to be rejected")
	}
}
