import { useHoneypotState } from "../api"

function Honeypots() {
  const { data, isLoading, isError } = useHoneypotState()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Honeypots</h1>
          <p className="mt-1.5 text-sm text-muted">
            Monitor deception infrastructure state.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-panel border border-border rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Honeypots</h1>
          <p className="mt-1.5 text-sm text-muted">
            Monitor deception infrastructure state.
          </p>
        </div>
        <div className="rounded-xl border border-danger-border bg-panel p-6">
          <p className="text-sm font-medium text-danger">Control plane unavailable</p>
        </div>
      </div>
    )
  }

  const honeypots = data ?? []

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Honeypots</h1>
        <p className="mt-1.5 text-sm text-muted">
          Monitor deception infrastructure state.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {honeypots.length === 0 ? (
          <div className="col-span-full flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50">
            <p className="text-sm font-medium text-muted">No honeypots configured or detected.</p>
          </div>
        ) : (
          honeypots.map((hp, index) => {
            const name = hp.name || hp.service || hp.id || `Service ${index + 1}`
            const status = hp.status || hp.state || "Unknown"
            const isUp = status.toLowerCase().startsWith("up")

            // Extract useful metadata ignoring raw ID/state
            const metadataEntries = Object.entries(hp).filter(
              ([k]) => !['name', 'service', 'id', 'status', 'state'].includes(k)
            )

            return (
              <div key={index} className="group rounded-xl border border-border bg-panel p-6 transition-colors hover:border-brand/40 hover:bg-panel-hover flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white capitalize">{name}</h2>
                    <p className="mt-1 font-mono text-xs text-muted">Node {index + 1}</p>
                  </div>
                  
                  <div className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 ${
                    isUp 
                      ? "border-success-border bg-success-bg" 
                      : "border-danger-border bg-danger-bg"
                  }`}>
                    <span className={`relative flex h-2 w-2 ${isUp ? "" : "hidden"}`}>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                    </span>
                    <span className={`text-xs font-semibold ${isUp ? "text-success" : "text-danger"}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {metadataEntries.length > 0 && (
                  <div className="mt-6 flex-1 rounded-lg border border-border bg-background p-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      {metadataEntries.map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-[10px] font-medium uppercase tracking-wider text-muted">{key}</dt>
                          <dd className="mt-1 font-mono text-xs text-gray-300 break-all">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Honeypots