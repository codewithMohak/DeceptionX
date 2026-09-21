import { useLatestSession, useCTIEvents } from "../api"

function CTIFeedPanel() {
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useLatestSession()

  const sessionId = sessionData?.session_id

  const {
    data,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useCTIEvents(sessionId)

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
                    {event.technique.technique_id} — {event.technique.technique_name}
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