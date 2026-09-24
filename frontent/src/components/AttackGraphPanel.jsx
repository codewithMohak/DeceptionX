import { useState } from "react"

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import { useLatestSession, useAttackGraph } from "../api"
import { useMode } from "../context/ModeContext"

function getNodeStyle(type) {
  switch (type) {
    case "discovery":
      return {
        border: "1px solid var(--color-info)",
        background: "var(--color-panel)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-info-bg)",
      }

    case "ssh_activity":
      return {
        border: "1px solid var(--color-warning)",
        background: "var(--color-panel)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-warning-bg)",
      }

    case "http_activity":
      return {
        border: "1px solid var(--color-success)",
        background: "var(--color-panel)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-success-bg)",
      }

    default:
      return {
        border: "1px solid var(--color-border)",
        background: "var(--color-panel)",
      }
  }
}

function getIndicatorColor(type) {
  switch (type) {
    case "discovery": return "bg-info"
    case "ssh_activity": return "bg-warning"
    case "http_activity": return "bg-success"
    default: return "bg-muted"
  }
}

function formatStage(type) {
  return type.replaceAll("_", " ")
}

function AttackGraphPanel() {
  const { mode } = useMode()
  const [selectedNode, setSelectedNode] = useState(null)

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError: isSessionError,
  } = useLatestSession()

  const sessionId = sessionData?.session_id

  const {
    data,
    isLoading: isGraphLoading,
    isError: isGraphError,
  } = useAttackGraph(sessionId)
  
  if (mode === "DEMO") {
    return (
      <section className="rounded-xl border border-border bg-panel flex flex-col h-full">
        <div className="p-6 border-b border-border bg-panel/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Attack Graph</h2>
            <p className="mt-1 text-xs text-muted">Session: DEMO</p>
          </div>
        </div>
        <div className="flex-1 relative bg-background min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-medium text-muted">
              No recorded attack graph available.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const isLoading = isSessionLoading || isGraphLoading
  const isError = isSessionError || isGraphError

  if (isLoading) {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full min-h-[500px]">
        <h2 className="text-lg font-semibold text-white">Attack Graph</h2>
        <div className="mt-6 flex-1 flex items-center justify-center animate-pulse">
          <p className="text-sm font-medium text-muted">Loading attack graph...</p>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-danger-border bg-panel p-6 flex flex-col h-full min-h-[500px]">
        <h2 className="text-lg font-semibold text-white">Attack Graph</h2>
        <div className="mt-6 flex-1 flex items-center justify-center">
          <p className="text-sm font-medium text-danger">Unable to load attack graph.</p>
        </div>
      </section>
    )
  }

  if (!sessionId) {
    return (
      <section className="rounded-xl border border-border bg-panel p-6 flex flex-col h-full min-h-[500px]">
        <h2 className="text-lg font-semibold text-white">Attack Graph</h2>
        <div className="mt-6 flex-1 flex items-center justify-center rounded-lg border border-dashed border-border bg-background/50">
          <p className="text-sm font-medium text-muted">No active CTI session found.</p>
        </div>
      </section>
    )
  }

  const nodes = (data?.nodes ?? []).map((node, index) => ({
    id: node.id,

    position: {
      x: index * 320,
      y: 150,
    },

    data: {
      label: (
        <div className="flex min-w-[220px] flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getIndicatorColor(node.type)}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {formatStage(node.type)}
            </p>
          </div>
          <p className="text-sm font-semibold text-white leading-tight">
            {node.label}
          </p>
        </div>
      ),
    },

    style: {
      ...getNodeStyle(node.type),
      borderRadius: "8px",
      padding: "16px",
      color: "white",
    },
  }))

  const edges = (data?.edges ?? []).map(edge => ({
    ...edge,
    style: { stroke: "var(--color-border)", strokeWidth: 2 },
    animated: true,
  }))

  function handleNodeClick(_, node) {
    setSelectedNode(node)
  }

  const selectedEvent = data?.nodes?.find(
    (node) => node.id === selectedNode?.id
  )

  return (
    <section className="rounded-xl border border-border bg-panel flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border bg-panel/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Attack Graph
          </h2>
          <p className="mt-1 text-xs text-muted">
            Session: <span className="font-mono text-gray-400">{sessionId}</span>
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Graph */}
        <div className="flex-1 relative bg-background">
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-muted">
                No attack activity recorded for this session.
              </p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              onNodeClick={handleNodeClick}
              className="dark"
            >
              <Background color="var(--color-border)" gap={24} size={1} />
              <Controls className="bg-panel border-border fill-white" />
              <MiniMap 
                nodeColor={(node) => {
                  if (node.id === selectedNode?.id) return 'var(--color-brand)'
                  return 'var(--color-border)'
                }}
                maskColor="rgba(10, 10, 10, 0.7)"
                className="bg-panel border border-border rounded-lg"
              />
            </ReactFlow>
          )}
        </div>

        {/* Selected event inspector pane */}
        {selectedNode && (
          <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-panel overflow-y-auto">
            <div className="p-5 flex items-center justify-between border-b border-border bg-panel/50">
              <h3 className="text-sm font-semibold text-white">
                Node Inspector
              </h3>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="rounded-md p-1.5 text-muted hover:bg-background hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Stage
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getIndicatorColor(selectedEvent?.type)}`} />
                  <p className="text-sm font-medium capitalize text-white">
                    {formatStage(selectedEvent?.type ?? "unknown")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Event
                </p>
                <div className="mt-2 rounded-lg border border-border bg-background p-3">
                  <p className="text-sm font-semibold text-white">
                    {selectedEvent?.label ?? "Unknown event"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Node ID
                </p>
                <p className="mt-2 font-mono text-xs text-gray-400 break-all bg-background border border-border rounded-md px-2 py-1">
                  {selectedNode.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AttackGraphPanel