import toposort from 'toposort'
import type { Connections, Node, TaskContext } from '@/utils/types'

export const topologicalSort = (nodes: Node[], connections: Connections[]): Array<Node> => {
  // If there are no connections, return the nodes
  if (connections.length === 0) {
    return nodes
  }

  // Add nodes with no connections as self-edges to ensure they're included
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ])

  const connectedNodeIds = new Set<string>()

  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId)
    connectedNodeIds.add(conn.toNodeId)
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id])
    }
  }

  // Perform topological sort
  let sortedNodeIds: string[]

  try {
    sortedNodeIds = toposort(edges)

    // Remove duplicate (from self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)]
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cyclic')) {
      throw new Error('Cyclic dependency detected in workflow nodes.')
    }

    throw error
  }

  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]))

  const allNodes = sortedNodeIds
    .map((nodeId) => nodeMap.get(nodeId))
    .filter((node): node is Node => node !== undefined)

  return allNodes
}

export function createTaskContext(): TaskContext {
  return {
    run: async <T>(_name: string, fn: () => Promise<T>): Promise<T> => {
      try {
        const result = await fn()
        return result
      } catch (error) {
        console.error('Error in task context run:', error)
        throw error
      }
    },
  }
}
