import CTIFeedPanel from "../components/CTIFeedPanel"

function CTIEvents() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          CTI Events
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Investigate threat intelligence generated from observed activity.
        </p>
      </div>

      <CTIFeedPanel />
    </div>
  )
}

export default CTIEvents