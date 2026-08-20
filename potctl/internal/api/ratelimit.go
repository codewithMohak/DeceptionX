package api

import (
	"sync"
	"time"
)

type RateLimiter struct {
	mu          sync.Mutex
	windowStart time.Time
	count       int
	limit       int
	window      time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		windowStart: time.Now(),
		limit:       limit,
		window:      window,
	}
}

func (r *RateLimiter) Allow() bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	now := time.Now()

	if now.Sub(r.windowStart) >= r.window {
		r.windowStart = now
		r.count = 0
	}

	if r.count >= r.limit {
		return false
	}
	r.count++
	return true
}
