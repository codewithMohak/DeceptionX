import { useState } from "react"

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

import Dashboard from "./pages/Dashboard"
import CTIEvents from "./pages/CTIEvents"
import AttackGraph from "./pages/AttackGraph"
import Honeypots from "./pages/Honeypots"

function App() {
  const [activePage, setActivePage] = useState("overview")

  function renderPage() {
    switch (activePage) {
      case "cti":
        return <CTIEvents />

      case "graph":
        return <AttackGraph />

      case "honeypots":
        return <Honeypots />

      case "overview":
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="ml-64 min-h-screen">
        <Topbar />

        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App