import HoneypotStatus from "../components/HoneypotStatus"

function Honeypots() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Honeypots
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor the current state of deployed deception services.
        </p>
      </div>

      <HoneypotStatus />
    </div>
  )
}

export default Honeypots