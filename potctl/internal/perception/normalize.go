package perception

func inferService(raw RawAlert) string {
	switch raw.EventType {
	case "http":
		return "http"

	case "ssh":
		return "ssh"

	case "alert":
		if raw.DestPort == 22 {
			return "ssh"
		}
		if raw.DestPort == 80 || raw.DestPort == 443 {
			return "http"
		}
		return "network"

	default:
		return "unknown"
	}
}

func buildSummary(raw RawAlert) string {
	switch raw.EventType {
	case "http":
		return "HTTP activity observed"

	case "ssh":
		return "SSH activity observed"

	case "alert":
		return "Suricata alert observed"

	default:
		return "Network event observed"
	}
}
