package perception

import (
	"encoding/json"
)

type RawAlert struct {
	Timestamp string          `json:"timestamp"`
	EventType string          `json:"event_type"`
	SrcIP     string          `json:"src_ip"`
	DestPort  int             `json:"dest_port"`
	Alert     json.RawMessage `json:"alert,omitempty"`
	HTTP      json.RawMessage `json:"http,omitempty"`
	SSH       json.RawMessage `json:"ssh,omitempty"`
}

type NormalizedEvent struct {
	Timestamp string `json:"timestamp"`
	SrcIP     string `json:"src_ip"`
	Service   string `json:"service"`
	Summary   string `json:"summary"`
}

func normailze(raw RawAlert) NormalizedEvent {
	return NormalizedEvent{
		Timestamp: raw.Timestamp,
		SrcIP:     raw.SrcIP,
		Service:   inferService(raw),
		Summary:   buildSummary(raw),
	}
}
