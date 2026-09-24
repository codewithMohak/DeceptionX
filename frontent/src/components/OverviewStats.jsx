import { useLatestSession, useCTIEvents, useHoneypotState } from "../api"

function OverviewStats() {
  const {
    data: honeypots = [],
    isLoading: honeypotsLoading,
  } = useHoneypotState()

  const { data: sessionData, isLoading: sessionLoading } = useLatestSession()
  const sessionId = sessionData?.session_id

  const {
    data: ctiData,
    isLoading: ctiEventsLoading,
  } = useCTIEvents(sessionId)

  const ctiLoading = sessionLoading || ctiEventsLoading

  const events = ctiData?.events ?? []

  const running = honeypots.filter((honeypot) =>
    honeypot.status.toLowerCase().startsWith("up")
  ).length

  const stats = [
    {
      label: "Honeypots",
      value: honeypotsLoading ? "…" : honeypots.length,
      colorClass: "text-white",
    },
    {
      label: "Running",
      value: honeypotsLoading ? "…" : running,
      colorClass: running > 0 ? "text-success" : "text-danger",
    },
    {
      label: "CTI Events",
      value: ctiLoading ? "…" : events.length,
      colorClass: events.length > 0 ? "text-warning" : "text-white",
    },
    {
      label: "Active Sessions",
      value: ctiLoading ? "…" : events.length > 0 ? 1 : 0,
      colorClass: events.length > 0 ? "text-info" : "text-white",
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-panel p-5 transition-all duration-200 hover:border-brand/50 hover:bg-panel-hover hover:shadow-lg hover:shadow-brand/5"
        >
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${stat.colorClass}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  )
}

export default OverviewStats