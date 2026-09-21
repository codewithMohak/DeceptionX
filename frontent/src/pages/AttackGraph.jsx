import AttackGraphPanel from "../components/AttackGraphPanel"

function AttackGraph() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Attack Graph
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Visualize the sequence of observed security events.
        </p>
      </div>

      <AttackGraphPanel />
    </div>
  )
}

export default AttackGraph