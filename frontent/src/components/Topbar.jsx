import { useMode } from "../context/ModeContext"

function Topbar() {
  const { mode } = useMode()
  const isLab = mode === "LAB"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Overview
        </h2>

        <p className="text-xs text-muted">
          DeceptionX security control plane
        </p>
      </div>

      <div className={`flex items-center gap-3 rounded-full border px-3 py-1.5 ${isLab ? "border-success-border bg-success-bg" : "border-info-border bg-info-bg"}`}>
        <span className="relative flex h-2 w-2">
          {isLab && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isLab ? "bg-success" : "bg-info"}`}></span>
        </span>
        <span className={`text-xs font-medium ${isLab ? "text-success" : "text-info"}`}>
          {isLab ? "System Online" : "Demo Mode"}
        </span>
      </div>
    </header>
  )
}

export default Topbar