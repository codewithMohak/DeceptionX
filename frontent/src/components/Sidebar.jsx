function Sidebar({ activePage, onNavigate }) {
  const navigation = [
    { id: "overview", label: "Overview" },
    { id: "cti", label: "CTI Events" },
    { id: "graph", label: "Attack Graph" },
    { id: "honeypots", label: "Honeypots" },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-panel flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-wide text-white">
          DeceptionX
        </h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
          Operations
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand/10 text-brand relative"
                  : "text-gray-400 hover:bg-panel-hover hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-brand" />
              )}
              {item.label}
            </button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 rounded-lg bg-background p-3 border border-border">
          <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30">
            <span className="text-sm font-bold text-brand">A</span>
          </div>
          <div>
            <p className="text-xs font-medium text-white">Analyst</p>
            <p className="text-[10px] text-muted">Local Session</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar