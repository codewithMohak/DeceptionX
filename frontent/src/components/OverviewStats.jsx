import { useQuery } from "@tanstack/react-query"
import { POTCTL_API_URL, CTI_API_URL, SOURCE_IP } from "../config"

async function fetchHoneypots() {
  const response = await fetch(`${POTCTL_API_URL}/state`, {
    headers: {
      "X-API-Key": import.meta.env.VITE_POTCTL_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch honeypot state")
  }

  return response.json()
}

async function fetchCTIEvents() {
  const sessionId = import.meta.env.VITE_CTI_SESSION_ID

  if (!sessionId) {
    throw new Error("VITE_CTI_SESSION_ID is not configured")
  }

  const response = await fetch(
     `${CTI_API_URL}/sessions/latest/${encodeURIComponent(SOURCE_IP)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch CTI events")
  }

  return response.json()
}

function OverviewStats() {
  const {
    data: honeypots = [],
    isLoading: honeypotsLoading,
  } = useQuery({
    queryKey: ["honeypots"],
    queryFn: fetchHoneypots,
    refetchInterval: 3000,
  })

  const {
    data: ctiData,
    isLoading: ctiLoading,
  } = useQuery({
    queryKey: ["cti-events"],
    queryFn: fetchCTIEvents,
    refetchInterval: 3000,
  })

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