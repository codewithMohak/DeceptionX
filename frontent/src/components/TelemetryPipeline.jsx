import { useLatestSession, useCTIEvents } from "../api"
import { useMode } from "../context/ModeContext"

function TelemetryPipeline() {
  const { mode } = useMode()
  const { data: sessionData, isLoading: sessionLoading } = useLatestSession()
  const { data: ctiData, isLoading: ctiLoading } = useCTIEvents(sessionData?.session_id)
  
  if (mode !== "LAB") return null

  const events = ctiData?.events ?? []
  const lastEvent = events.length > 0 ? events[0] : null
  const formattedTime = lastEvent 
    ? new Date(lastEvent.timestamp).toLocaleTimeString() 
    : "Awaiting telemetry"
    
  const isConnected = !sessionLoading && !ctiLoading && events.length > 0

  return (
    <div className="rounded-xl border border-border bg-panel p-5 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              Real-Time Telemetry
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            Last event: {formattedTime}
          </p>
        </div>

        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-muted overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className={isConnected ? "text-brand" : ""}>Attacker</span>
            <span className="mx-2 text-border">→</span>
            <span className={isConnected ? "text-brand" : ""}>Suricata</span>
            <span className="mx-2 text-border">→</span>
            <span className={isConnected ? "text-brand" : ""}>Honeypot</span>
            <span className="mx-2 text-border">→</span>
            <span className={isConnected ? "text-brand" : ""}>CTI</span>
            <span className="mx-2 text-border">→</span>
            <span className={isConnected ? "text-brand" : ""}>Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemetryPipeline
