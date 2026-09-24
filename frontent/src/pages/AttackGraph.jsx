import AttackGraphPanel from "../components/AttackGraphPanel"

function AttackGraph() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Attack Graph
        </h1>

        <p className="mt-1.5 text-sm text-muted">
          Visualize the sequence of observed security events.
        </p>
      </div>

      <div className="flex-1 min-h-[600px]">
        <AttackGraphPanel />
      </div>
    </div>
  )
}

export default AttackGraph