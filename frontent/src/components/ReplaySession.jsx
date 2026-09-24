import { useMode } from "../context/ModeContext"

function ReplaySession() {
  const { mode } = useMode()
  
  if (mode !== "DEMO") return null

  return (
    <div className="rounded-xl border border-border bg-panel p-5 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-info"></span>
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              Recorded Session
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            No recorded sessions available.
          </p>
        </div>

        <div className="flex-1 max-w-sm rounded-lg border border-dashed border-border bg-background/50 p-4 text-center">
          <p className="text-[10px] text-muted">
            Replay sessions will appear here once a recorded intrusion is available.
          </p>
        </div>

        <div>
          <button 
            disabled 
            className="rounded bg-info/10 px-4 py-2 text-xs font-bold text-info border border-info/20 opacity-50 cursor-not-allowed"
          >
            ▶ Replay the Intrusion
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReplaySession
