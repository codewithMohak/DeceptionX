import { useLatestSession, useCTIEvents } from "../api"

function RecentActivity() {
  const { data: sessionData, isLoading: sessionLoading, isError: sessionError } = useLatestSession()
  const sessionId = sessionData?.session_id
  
  const { data, isLoading: eventsLoading, isError: eventsError } = useCTIEvents(sessionId)
  
  const isLoading = sessionLoading || eventsLoading
  const isError = sessionError || eventsError

  if (isLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          Loading activity...
        </p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-4 text-sm text-red-400">
          Unable to load recent activity.
        </p>
      </section>
    )
  }

  const events = [...(data?.events ?? [])]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 5)

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest security events observed by DeceptionX.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activity.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={`${event.flow_id}-${event.signature_id}`}
              className="rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">
                    {event.signature}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {event.evidence}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-gray-500">
                  SID {event.signature_id}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>Source: {event.src_ip}</span>

                {event.technique ? (
                  <span>
                    MITRE: {event.technique.technique_id}
                  </span>
                ) : (
                  <span>No MITRE mapping</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default RecentActivity