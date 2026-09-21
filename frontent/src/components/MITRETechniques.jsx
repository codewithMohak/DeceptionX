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

function MITRETechniques() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cti-events"],
    queryFn: fetchCTIEvents,
    refetchInterval: 3000,
  })

  if (isLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          MITRE Techniques
        </h2>
        <p className="mt-4 text-sm text-gray-500">
          Loading techniques...
        </p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          MITRE Techniques
        </h2>
        <p className="mt-4 text-sm text-red-400">
          Unable to load techniques.
        </p>
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

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          MITRE Techniques
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          ATT&CK techniques mapped from observed activity.
        </p>
      </div>

      <div className="mt-5">
        {techniques.length === 0 ? (
          <p className="text-sm text-gray-500">
            No mapped MITRE ATT&CK techniques for this session.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {techniques.map((technique) => (
              <div
                key={technique.technique_id}
                className="rounded-lg border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-white">
                    {technique.technique_id}
                  </span>

                  <span className="text-sm font-medium text-white">
                    {technique.technique_name}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-500">
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