package storage

import (
	"database/sql"
	"fmt"
	"os"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

func New(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	if _, err := db.Exec(`PRAGMA journal_model=WAL`); err != nil {
		db.Close()
		return nil, err
	}
	if err := initializeSchema(db); err != nil {
		db.Close()
		return nil, err
	}
	return &Store{db: db}, nil
}

func initializeSchema(db *sql.DB) error {
	schema, err := os.ReadFile("schema.sql")
	if err != nil {
		return fmt.Errorf("read schema: %w", err)
	}
	if _, err := db.Exec(string(schema)); err != nil {
		return fmt.Errorf("initialize schema: %w", err)
	}
	return nil
}

func (s *Store) RecordAction(
	actionType string,
	target string,
	actor string,
	reason string,
	result string,
) error {
	_, err := s.db.Exec(
		`INSERT INTO action
			(action_type, target, actor, reason, result)
		 VALUES (?, ?, ?, ?, ?)`,
		actionType,
		target,
		actor,
		reason,
		result,
	)

	return err
}
