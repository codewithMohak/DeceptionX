function Sidebar({ activePage, onNavigate }) {
  const navigation = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "cti",
      label: "CTI Events",
    },
    {
      id: "graph",
      label: "Attack Graph",
    },
    {
      id: "honeypots",
      label: "Honeypots",
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-black p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">
          DeceptionX
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          Security Operations
        </p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar