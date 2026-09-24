import { createContext, useContext, useState } from "react"

const ModeContext = createContext(null)

export function ModeProvider({ children }) {
  const [mode, setMode] = useState("LAB") // "LAB" or "DEMO"

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
