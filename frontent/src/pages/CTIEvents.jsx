import CTIFeedPanel from "../components/CTIFeedPanel"

function CTIEvents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          CTI Events
        </h1>

        <p className="mt-1.5 text-sm text-muted">
          Investigate threat intelligence generated from observed activity.
        </p>
      </div>

      <CTIFeedPanel />
    </div>
  )
}

export default CTIEvents