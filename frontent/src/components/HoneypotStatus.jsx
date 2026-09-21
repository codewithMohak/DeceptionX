import { useQuery } from "@tanstack/react-query"

async function fetchHoneypots() {
  const response = await fetch("http://127.0.0.1:8081/state", {
    headers: {
      "X-API-Key": import.meta.env.VITE_POTCTL_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch honeypot state")
  }

  return response.json()
}

function HoneypotStatus() {
  const {
    data: honeypots,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["honeypots"],
    queryFn: fetchHoneypots,
    refetchInterval: 3000,
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">
          Loading honeypot status...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          Unable to connect to potctl.
        </p>
      </div>
    )
  }

  return (
    <section>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Honeypot Status
        </h3>

        <p className="text-sm text-gray-500">
          Live state from the DeceptionX control plane.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {honeypots.map((honeypot) => (
          <div
            key={honeypot.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {honeypot.name.replace("/", "")}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {honeypot.status}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                <span className="text-xs text-green-400">
                  Running
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HoneypotStatus