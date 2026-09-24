import { useState } from "react"
import { ModeProvider } from "./context/ModeContext"

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
    <ModeProvider>
      <div className="min-h-screen bg-background text-gray-100 selection:bg-brand/30">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
        />

        <main className="ml-64 min-h-screen flex flex-col">
          <Topbar />

          <div className="p-8 flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </ModeProvider>
  )
}

export default App