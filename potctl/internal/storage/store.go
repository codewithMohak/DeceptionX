package storage

import (
	"database/sql"
	_ "embed"
	"fmt"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

//go:embed schema.sql
var schemaSQL string

func New(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	if _, err := db.Exec(`PRAGMA journal_mode=WAL`); err != nil {
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
	if _, err := db.Exec(schemaSQL); err != nil {
		return fmt.Errorf("execute schema: %w", err)
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

func (s *Store) Close() error {
	return s.db.Close()
}
