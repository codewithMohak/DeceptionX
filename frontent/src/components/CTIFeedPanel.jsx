import { useQuery } from "@tanstack/react-query"

async function fetchCTIEvents() {
  const sessionId = import.meta.env.VITE_CTI_SESSION_ID

  if (!sessionId) {
    throw new Error("VITE_CTI_SESSION_ID is not configured")
  }

  const response = await fetch(
  `http://127.0.0.1:8090/cti/${encodeURIComponent(sessionId)}`
)

  if (!response.ok) {
    throw new Error("Failed to fetch CTI events")
  }

  return response.json()
}

function CTIFeedPanel() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cti-events"],
    queryFn: fetchCTIEvents,
    refetchInterval: 3000,
  })

  if (isLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">
          Loading CTI events...
        </p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          Unable to load CTI events.
        </p>
      </section>
    )
  }

  const events = data?.events ?? []

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">
          Recent CTI Activity
        </h3>

        <p className="text-sm text-gray-500">
          Threat intelligence generated from observed activity.
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    {event.signature}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Source: {event.src_ip}
                  </p>
                </div>

                <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-gray-400">
                  SID {event.signature_id}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-400">
                {event.evidence}
              </p>

              {event.technique ? (
                <div className="mt-3">
                  <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                    {event.technique.technique_id}
                  </span>

                  <span className="ml-2 text-xs text-gray-500">
                    {event.technique.technique_name}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-600">
                  No MITRE ATT&CK mapping
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CTIFeedPanel