import { useLatestSession, useCTIEvents } from "../api"
import { maskIP } from "../utils/privacy"
import { useMode } from "../context/ModeContext"

function RecentActivity() {
  const { mode } = useMode()
  const { data: sessionData, isLoading: sessionLoading, isError: sessionError } = useLatestSession()
  const sessionId = sessionData?.session_id
  
  const { data, isLoading: eventsLoading, isError: eventsError } = useCTIEvents(sessionId)
  
  if (mode === "DEMO") {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <p className="mt-1 text-sm text-muted">Latest security events observed.</p>
        </div>
        <div className="mt-6 flex-1 flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50">
          <p className="text-sm font-medium text-muted">No activity in demo mode until replay starts.</p>
        </div>
      </section>
    )
  }

  const isLoading = sessionLoading || eventsLoading
  const isError = sessionError || eventsError

  if (isLoading) {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full min-h-[300px]">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <div className="mt-6 space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-border/50 rounded-lg w-full"></div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-danger-border bg-panel p-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <p className="mt-4 text-sm font-medium text-danger">Unable to load recent activity.</p>
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
    <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-muted">
          Latest security events observed by DeceptionX.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        {events.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50">
            <p className="text-sm font-medium text-muted">No recent activity.</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={`${event.flow_id}-${event.signature_id}`}
              className="group relative flex gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-brand/40 hover:bg-panel-hover"
            >
              {/* Timeline indicator */}
              <div className="absolute -left-[1px] top-4 h-8 w-[2px] rounded-r-md bg-brand opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {event.signature}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {event.evidence}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-brand">
                    SID {event.signature_id}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-background px-2 py-1 font-mono text-[10px] font-bold text-gray-300 border border-border">
                    {maskIP(event.src_ip)}
                  </span>

                  {event.technique ? (
                    <span className="rounded bg-warning-bg px-2 py-1 text-[10px] font-semibold text-warning border border-warning-border">
                      {event.technique.technique_id}
                    </span>
                  ) : (
                    <span className="rounded bg-muted-bg px-2 py-1 text-[10px] font-medium text-muted border border-muted-border">
                      Unmapped
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default RecentActivity