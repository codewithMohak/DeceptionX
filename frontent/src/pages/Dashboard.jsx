import OverviewStats from "../components/OverviewStats"
import RecentActivity from "../components/RecentActivity"
import MITRETechniques from "../components/MITRETechniques"

function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Overview
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor deception infrastructure and observed attacker activity.
        </p>
      </div>

      <div className="space-y-6">
        <OverviewStats />

        <div className="grid gap-6 xl:grid-cols-2">
          <RecentActivity />
          <MITRETechniques />
        </div>
      </div>
    </div>
  )
}

export default Dashboard