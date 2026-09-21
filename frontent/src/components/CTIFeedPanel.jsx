import { useQuery } from "@tanstack/react-query"

const CTI_API_URL = "http://192.168.242.142:8090"
const SOURCE_IP = "192.168.242.1"

async function fetchLatestSession() {
  const response = await fetch(
    `${CTI_API_URL}/sessions/latest/${encodeURIComponent(SOURCE_IP)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch latest session")
  }

  return response.json()
}

async function fetchCTIEvents(sessionId) {
  if (!sessionId) {
    return {
      session_id: null,
      events: [],
    }
  }

  const response = await fetch(
    `${CTI_API_URL}/cti/${encodeURIComponent(sessionId)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch CTI events")
  }

  return response.json()
}

function CTIFeedPanel() {
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ["latest-session", SOURCE_IP],
    queryFn: fetchLatestSession,
    refetchInterval: 3000,
  })

  const sessionId = sessionData?.session_id

  const {
    data,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ["cti-events", sessionId],
    queryFn: () => fetchCTIEvents(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: 3000,
  })

  if (sessionLoading || eventsLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">
          Loading CTI events...
        </p>
      </section>
    )
  }

  if (sessionError || eventsError) {
    return (
      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          Failed to load CTI events.
        </p>
      </section>
    )
  }

  const events = data?.events ?? []

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          CTI Events
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Session: {sessionId ?? "No active session"}
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">
          No CTI events recorded for this session.
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={`${event.flow_id}-${event.signature_id}`}
              className="rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm font-medium text-white">
                {event.signature}
              </p>

              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <p>
                  Source: {event.src_ip}
                </p>

                <p>
                  SID: {event.signature_id}
                </p>

                <p>
                  Flow: {event.flow_id}
                </p>

                <p>
                  Evidence: {event.evidence}
                </p>
              </div>

              <div className="mt-3">
                {event.technique ? (
                  <span className="text-xs text-blue-400">
                    {event.technique.id} — {event.technique.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    No MITRE ATT&CK mapping
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CTIFeedPanel