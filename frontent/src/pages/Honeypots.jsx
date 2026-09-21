import { useHoneypotState } from "../api"

function Honeypots() {
  const { data, isLoading, isError } = useHoneypotState()

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Honeypots</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor deception infrastructure state.
          </p>
        </div>
        <p className="text-sm text-gray-500">Loading honeypot status...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Honeypots</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor deception infrastructure state.
          </p>
        </div>
        <p className="text-sm text-red-400">Control plane unavailable</p>
      </div>
    )
  }

  const honeypots = data ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Honeypots</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor deception infrastructure state.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {honeypots.length === 0 ? (
          <p className="text-sm text-gray-500">No honeypots configured or detected.</p>
        ) : (
          honeypots.map((hp, index) => {
            // Safely try to get a name and status, fallback to stringified object
            const name = hp.name || hp.service || hp.id || `Service ${index + 1}`
            const status = hp.status || hp.state || "Unknown"
            const isUp = status.toLowerCase().startsWith("up")

            return (
              <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white capitalize">{name}</h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${isUp ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-gray-500/20 text-gray-400 border border-gray-500/20"}`}>
                    {status}
                  </span>
                </div>
                <div className="mt-3 overflow-auto">
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap">
                    {JSON.stringify(hp, null, 2)}
                  </pre>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Honeypots