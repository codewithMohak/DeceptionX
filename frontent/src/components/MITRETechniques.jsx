import { useLatestSession, useCTIEvents } from "../api"
import { useMode } from "../context/ModeContext"

function MITRETechniques() {
  const { mode } = useMode()
  const { data: sessionData, isLoading: sessionLoading, isError: sessionError } = useLatestSession()
  const sessionId = sessionData?.session_id

  const { data, isLoading: eventsLoading, isError: eventsError } = useCTIEvents(sessionId)
  
  if (mode === "DEMO") {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full">
        <div>
          <h2 className="text-lg font-semibold text-white">MITRE Techniques</h2>
          <p className="mt-1 text-sm text-muted">ATT&CK techniques mapped from observed activity.</p>
        </div>
        <div className="mt-6 flex-1 flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 p-6 text-center">
          <p className="text-sm font-medium text-muted">Techniques will appear here once replay starts.</p>
        </div>
      </section>
    )
  }

  const isLoading = sessionLoading || eventsLoading
  const isError = sessionError || eventsError

  if (isLoading) {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full min-h-[300px]">
        <h2 className="text-lg font-semibold text-white">MITRE Techniques</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-border/50 rounded-lg w-full"></div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-danger-border bg-panel p-6">
        <h2 className="text-lg font-semibold text-white">MITRE Techniques</h2>
        <p className="mt-4 text-sm font-medium text-danger">Unable to load techniques.</p>
      </section>
    )
  }

  const events = data?.events ?? []

  const techniques = Array.from(
    new Map(
      events
        .filter((event) => event.technique)
        .map((event) => [
          event.technique.technique_id,
          event.technique,
        ])
    ).values()
  )
  
  const unmappedCount = events.length - techniques.length;

  return (
    <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full">
      <div>
        <h2 className="text-lg font-semibold text-white">
          MITRE Techniques
        </h2>

        <p className="mt-1 text-sm text-muted">
          ATT&CK techniques mapped from observed activity.
        </p>
      </div>

      <div className="mt-6 flex-1">
        {techniques.length === 0 ? (
          <div className="flex flex-col h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 p-6 text-center">
            <p className="text-sm font-semibold text-white">No mapped techniques yet</p>
            <p className="mt-2 text-xs font-medium text-muted">
              Observed signatures currently have no defensible ATT&CK mapping.
            </p>
            {events.length > 0 && (
              <p className="mt-3 inline-block rounded bg-muted-bg px-2 py-1 text-[10px] font-bold text-muted border border-muted-border">
                Unmapped signatures: {unmappedCount}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {techniques.map((technique) => (
              <div
                key={technique.technique_id}
                className="group flex flex-col rounded-lg border border-border bg-background p-4 transition-colors hover:border-warning-border hover:bg-warning-bg"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded bg-warning-bg px-2 py-1 font-mono text-xs font-semibold tracking-wide text-warning border border-warning-border transition-colors group-hover:bg-warning/20">
                    {technique.technique_id}
                  </span>

                  <span className="text-sm font-medium text-white line-clamp-1">
                    {technique.technique_name}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Tactic: {technique.tactic}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MITRETechniques