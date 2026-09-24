import { useLatestSession, useCTIEvents } from "../api"
import { maskIP } from "../utils/privacy"
import { useMode } from "../context/ModeContext"

function CTIFeedPanel() {
  const { mode } = useMode()
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
  
  if (mode === "DEMO") {
    return (
      <section className="rounded-xl border border-border bg-panel overflow-hidden">
        <div className="p-6 border-b border-border bg-panel/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">CTI Events</h2>
            <p className="mt-1 text-xs text-muted">Session: DEMO</p>
          </div>
          <div className="text-sm font-medium text-muted">0 events</div>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-sm font-medium text-muted">
            CTI events will stream here once replay starts.
          </p>
        </div>
      </section>
    )
  }

  if (sessionLoading || eventsLoading) {
    return (
      <section className="rounded-xl border border-border bg-panel flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-white">CTI Events</h2>
          <p className="mt-1 text-xs text-muted">Loading feed...</p>
        </div>
        <div className="p-6 space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-border/50 rounded-lg w-full"></div>
          ))}
        </div>
      </section>
    )
  }

  if (sessionError || eventsError) {
    return (
      <section className="rounded-xl border border-danger-border bg-panel p-6">
        <p className="text-sm font-medium text-danger">Failed to load CTI events.</p>
      </section>
    )
  }

  const events = data?.events ?? []

  return (
    <section className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="p-6 border-b border-border bg-panel/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            CTI Events
          </h2>
          <p className="mt-1 text-xs text-muted">
            Session: {sessionId ?? "No active session"}
          </p>
        </div>
        <div className="text-sm font-medium text-muted">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-sm font-medium text-muted">
            No CTI events recorded for this session.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {events.map((event) => (
            <div
              key={`${event.flow_id}-${event.signature_id}`}
              className="group flex flex-col p-4 transition-colors hover:bg-panel-hover sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand border border-brand/20">
                    SID {event.signature_id}
                  </span>
                  <p className="truncate text-sm font-semibold text-white">
                    {event.signature}
                  </p>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">Source:</span>
                    <span className="font-mono text-xs font-bold text-gray-300">{maskIP(event.src_ip)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">Flow:</span>
                    <span className="font-mono text-xs text-gray-300">{event.flow_id}</span>
                  </div>
                  <div className="flex-1 min-w-[200px] truncate">
                    <span className="text-xs text-muted">Evidence: </span>
                    <span className="font-mono text-[10px] text-gray-400 truncate">{event.evidence}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
                {event.technique ? (
                  <div className="flex items-center gap-2 rounded bg-warning-bg px-2.5 py-1.5 border border-warning-border">
                    <span className="font-mono text-[10px] font-bold text-warning">
                      {event.technique.technique_id}
                    </span>
                    <span className="text-xs font-medium text-warning/90 truncate max-w-[150px]">
                      {event.technique.technique_name}
                    </span>
                  </div>
                ) : (
                  <div className="rounded bg-muted-bg px-2.5 py-1.5 border border-muted-border">
                    <span className="text-xs font-medium text-muted">
                      Unmapped
                    </span>
                  </div>
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