function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Overview
        </h2>

        <p className="text-xs text-gray-500">
          DeceptionX security control plane
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400" />

        <span className="text-sm text-gray-400">
          System Online
        </span>
      </div>
    </header>
  )
}

export default Topbar