import { useState } from "react"

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import { useLatestSession, useAttackGraph } from "../api"

function getNodeStyle(type) {
  switch (type) {
    case "discovery":
      return {
        border: "1px solid rgb(59 130 246)",
        background: "rgb(30 58 138 / 0.35)",
      }

    case "ssh_activity":
      return {
        border: "1px solid rgb(234 179 8)",
        background: "rgb(113 63 18 / 0.35)",
      }

    case "http_activity":
      return {
        border: "1px solid rgb(34 197 94)",
        background: "rgb(20 83 45 / 0.35)",
      }

    default:
      return {
        border: "1px solid rgb(107 114 128)",
        background: "rgb(31 41 55 / 0.35)",
      }
  }
}

function formatStage(type) {
  return type.replaceAll("_", " ")
}

function AttackGraphPanel() {
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

  const isLoading = isSessionLoading || isGraphLoading
  const isError = isSessionError || isGraphError

  if (isLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          Attack Graph
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          Loading attack graph...
        </p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          Attack Graph
        </h2>

        <p className="mt-4 text-sm text-red-400">
          Unable to load attack graph.
        </p>
      </section>
    )
  }

  if (!sessionId) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">
          Attack Graph
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          No active CTI session found.
        </p>
      </section>
    )
  }

  const nodes = (data?.nodes ?? []).map((node, index) => ({
    id: node.id,

    position: {
      x: index * 300,
      y: 100,
    },

    data: {
      label: (
        <div className="min-w-[200px]">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {formatStage(node.type)}
          </p>

          <p className="mt-2 text-sm font-medium text-white">
            {node.label}
          </p>
        </div>
      ),
    },

    style: {
      ...getNodeStyle(node.type),
      borderRadius: "10px",
      padding: "12px",
      color: "white",
    },
  }))

  const edges = data?.edges ?? []

  function handleNodeClick(_, node) {
    setSelectedNode(node)
  }

  const selectedEvent = data?.nodes?.find(
    (node) => node.id === selectedNode?.id
  )

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      {/* Header */}

      <div>
        <h2 className="text-lg font-semibold text-white">
          Attack Graph
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Visualize the sequence of observed security events.
        </p>
      </div>

      {/* Current session */}

      <div className="mt-3">
        <p className="text-xs text-gray-500">
          Session
        </p>

        <p className="mt-1 break-all text-xs text-gray-400">
          {sessionId}
        </p>
      </div>

      {/* Graph */}

      <div className="mt-5 h-[450px] overflow-hidden rounded-lg border border-white/10 bg-black/20">
        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              No attack activity recorded for this session.
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            onNodeClick={handleNodeClick}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        )}
      </div>

      {/* Selected event */}

      {selectedNode && (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Event Details
            </h3>

            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-xs text-gray-500 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">
                Stage
              </p>

              <p className="mt-1 text-sm capitalize text-white">
                {formatStage(selectedEvent?.type ?? "unknown")}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Event
              </p>

              <p className="mt-1 text-sm text-white">
                {selectedEvent?.label ?? "Unknown event"}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AttackGraphPanel