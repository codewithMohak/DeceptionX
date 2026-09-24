import { useLatestSession, useCTIEvents } from "../api"
import { maskIP } from "../utils/privacy"
import { useMode } from "../context/ModeContext"

function AttackSourceMap() {
  const { mode } = useMode()
  const { data: sessionData } = useLatestSession()
  const sessionId = sessionData?.session_id
  const { data: ctiData } = useCTIEvents(sessionId)
  
  if (mode !== "LAB") return null
  
  const events = ctiData?.events ?? []
  const sources = new Set(events.map(e => e.src_ip).filter(Boolean))
  const sourceArr = Array.from(sources)
  
  return (
    <div className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full">
      <div>
        <h2 className="text-lg font-semibold text-white uppercase tracking-wide">
          Attack Source Map
        </h2>
        <p className="mt-1 text-sm text-muted">
          Operational visualization of attack flow.
        </p>
      </div>

      <div className="mt-6 flex-1 flex flex-col items-center justify-center">
        {sourceArr.length === 0 ? (
          <p className="text-sm font-medium text-muted">No active attack sources.</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded border border-brand/30 bg-brand/10 px-4 py-2 text-center">
              <p className="font-mono text-sm font-bold text-brand">{maskIP(sourceArr[0])}</p>
              <p className="text-[10px] uppercase text-brand/70">{events.length} events • 1 session</p>
            </div>
            
            <div className="h-6 w-[1px] bg-gradient-to-b from-brand/50 to-border animate-pulse"></div>
            
            <div className="rounded border border-border bg-background px-4 py-2 shadow shadow-brand/5">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Suricata</p>
            </div>

            <div className="h-6 w-[1px] bg-border"></div>
            
            <div className="rounded border border-border bg-background px-4 py-2 shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Honeypot</p>
            </div>

            <div className="h-6 w-[1px] bg-border"></div>
            
            <div className="rounded border border-border bg-background px-4 py-2 shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-white">CTI Engine</p>
            </div>
            
            {sourceArr.length > 1 && (
              <p className="mt-4 text-[10px] text-muted">
                + {sourceArr.length - 1} additional sources
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttackSourceMap
