import { useMode } from "../context/ModeContext"

function ModeSwitcher() {
  const { mode, setMode } = useMode()

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-1">
      <button
        type="button"
        onClick={() => setMode("LAB")}
        className={`rounded-md px-4 py-1.5 text-xs font-bold tracking-wide transition-colors ${
          mode === "LAB"
            ? "bg-brand/20 text-brand border border-brand/30"
            : "text-muted hover:text-white"
        }`}
      >
        LAB MODE
      </button>
      
      <button
        type="button"
        onClick={() => setMode("DEMO")}
        className={`rounded-md px-4 py-1.5 text-xs font-bold tracking-wide transition-colors ${
          mode === "DEMO"
            ? "bg-info/20 text-info border border-info/30"
            : "text-muted hover:text-white"
        }`}
      >
        DEMO MODE
      </button>
    </div>
  )
}

export default ModeSwitcher
