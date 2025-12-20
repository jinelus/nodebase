import { AbortTaskRunError, schemaTask } from '@trigger.dev/sdk'
import z from 'zod'
import { db } from '@/db/connection'
import type { NodeType } from '@/utils/types'
import { getExecutor } from '../executor-registry'
import { pusher } from '../pusher'
import { createTaskContext, topologicalSort } from './utils'

export type NodeStatus = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR'
export type NodeExecution = {
  nodeId: string
  status: NodeStatus
  startedAt?: number
  completedAt?: number
  error?: string
}

export const executeWorkflow = schemaTask({
  id: 'execute-workflow',
  schema: z.object({
    workflowId: z.string(),
    initialData: z.record(z.string(), z.unknown()).optional(),
  }),
  run: async (payload) => {
    const workflow = await db.query.workflows.findFirst({
      where: (workflow, { eq }) => eq(workflow.id, payload.workflowId),
      with: { node: true, connections: true },
    })

    if (!workflow) {
      throw new AbortTaskRunError('Workflow not found')
    }

    const sortedNodes = topologicalSort(workflow.node, workflow.connections)
    const channel = `workflow-${workflow.id}`

    let context = payload?.initialData || {}

    // Initialize node executions tracking by metadata
    const nodeExecutions: Record<string, NodeExecution> = {}
    sortedNodes.forEach((node) => {
      nodeExecutions[node.id] = { nodeId: node.id, status: 'INITIAL' }
    })
    await pusher.trigger(channel, 'nodes', nodeExecutions)

    for (const node of sortedNodes) {
      // Update node status to LOADING
      nodeExecutions[node.id] = {
        nodeId: node.id,
        status: 'LOADING',
        startedAt: Date.now(),
      }
      await pusher.trigger(channel, 'nodes', nodeExecutions)

      try {
        const executor = getExecutor(node.type as NodeType)
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context,
          taskContext: createTaskContext(),
        })

        // Update node status to SUCCESS
        nodeExecutions[node.id] = {
          ...nodeExecutions[node.id],
          status: 'SUCCESS',
          completedAt: Date.now(),
        }
        await pusher.trigger(channel, 'nodes', nodeExecutions)
      } catch (error) {
        nodeExecutions[node.id] = {
          ...nodeExecutions[node.id],
          status: 'ERROR',
          completedAt: Date.now(),
          error: error instanceof AbortTaskRunError ? error.message : 'Unknown error',
        }
        await pusher.trigger(channel, 'nodes', nodeExecutions)

        throw error
      }
    }

    return {
      workflowId: workflow.id,
      finalContext: context,
    }
  },
})
