import OverviewStats from "../components/OverviewStats"
import RecentActivity from "../components/RecentActivity"
import MITRETechniques from "../components/MITRETechniques"
import ModeSwitcher from "../components/ModeSwitcher"
import TelemetryPipeline from "../components/TelemetryPipeline"
import ReplaySession from "../components/ReplaySession"
import AttackSourceMap from "../components/AttackSourceMap"

function Dashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Overview
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Monitor deception infrastructure and observed attacker activity.
          </p>
        </div>
        <ModeSwitcher />
      </div>

      <div className="mb-8">
        <TelemetryPipeline />
        <ReplaySession />
      </div>

      <div className="space-y-6">
        <OverviewStats />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <AttackSourceMap />
          </div>
        </div>
        
        <div className="grid gap-6 xl:grid-cols-2">
          <MITRETechniques />
        </div>
      </div>
    </div>
  )
}

export default Dashboard