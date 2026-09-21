import { useQuery } from "@tanstack/react-query"
import { POTCTL_API_URL, CTI_API_URL, SOURCE_IP, POTCTL_API_KEY } from "./config"

const REFETCH_INTERVAL = 3000

export async function fetchLatestSession() {
  if (!SOURCE_IP || !CTI_API_URL) return null;
  const response = await fetch(
    `${CTI_API_URL}/sessions/latest/${encodeURIComponent(SOURCE_IP)}`
  )
  if (!response.ok) {
    if (response.status === 404) return null; // No session yet
    throw new Error("Failed to fetch latest session")
  }
  return response.json()
}

export async function fetchCTIEvents(sessionId) {
  if (!sessionId || !CTI_API_URL) return { session_id: null, events: [] };
  const response = await fetch(
    `${CTI_API_URL}/cti/${encodeURIComponent(sessionId)}`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch CTI events")
  }
  return response.json()
}

export async function fetchAttackGraph(sessionId) {
  if (!sessionId || !CTI_API_URL) return { session_id: null, nodes: [], edges: [] };
  const response = await fetch(
    `${CTI_API_URL}/graph/${encodeURIComponent(sessionId)}`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch attack graph")
  }
  return response.json()
}

export async function fetchHoneypots() {
  if (!POTCTL_API_URL) return [];
  const response = await fetch(`${POTCTL_API_URL}/state`, {
    headers: {
      "X-API-Key": POTCTL_API_KEY || "",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch honeypot state")
  }
  return response.json()
}

export function useLatestSession() {
  return useQuery({
    queryKey: ["latest-session", SOURCE_IP],
    queryFn: fetchLatestSession,
    refetchInterval: REFETCH_INTERVAL,
  })
}

export function useCTIEvents(sessionId) {
  return useQuery({
    queryKey: ["cti-events", sessionId],
    queryFn: () => fetchCTIEvents(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: REFETCH_INTERVAL,
  })
}

export function useAttackGraph(sessionId) {
  return useQuery({
    queryKey: ["attack-graph", sessionId],
    queryFn: () => fetchAttackGraph(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: REFETCH_INTERVAL,
  })
}

export function useHoneypotState() {
  return useQuery({
    queryKey: ["honeypot-state"],
    queryFn: fetchHoneypots,
    refetchInterval: REFETCH_INTERVAL,
  })
}
