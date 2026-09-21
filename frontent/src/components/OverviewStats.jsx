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
    },
    {
      label: "Running",
      value: honeypotsLoading ? "…" : running,
    },
    {
      label: "CTI Events",
      value: ctiLoading ? "…" : events.length,
    },
    {
      label: "Active Sessions",
      value: ctiLoading ? "…" : events.length > 0 ? 1 : 0,
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>

          <p className="mt-3 text-3xl font-semibold text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  )
}

export default OverviewStats