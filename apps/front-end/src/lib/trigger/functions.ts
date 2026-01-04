import { AbortTaskRunError, schemaTask } from '@trigger.dev/sdk'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/db/connection'
import { executions } from '@/db/schemas'
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
  id: `execute-workflow`,
  schema: z.object({
    workflowId: z.string(),
    initialData: z.record(z.string(), z.unknown()).optional(),
  }),
  onFailure: async (data) => {
    const runId = data.ctx.run.id
    const workflowId = data.payload.workflowId

    await db
      .update(executions)
      .set({
        completedAt: new Date(),
        status: 'FAILED',
        error: data.error instanceof Error ? data.error.message : 'Unknown error',
        errorStack: data.error instanceof Error ? (data.error.stack ?? null) : null,
      })
      .where(and(eq(executions.triggerEventId, runId), eq(executions.workflowId, workflowId)))
  },
  run: async (payload, { ctx }) => {
    const runId = ctx.run.id
    const workflow = await db.query.workflows.findFirst({
      where: (workflow, { eq }) => eq(workflow.id, payload.workflowId),
      with: { node: true, connections: true },
    })

    if (!runId || !workflow) {
      throw new AbortTaskRunError('RunId or Workflow is missing')
    }

    await db.insert(executions).values({
      workflowId: workflow.id,
      triggerEventId: runId,
    })

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
          userId: workflow.userId,
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

    await db
      .update(executions)
      .set({
        completedAt: new Date(),
        status: 'SUCCESS',
        output: context,
      })
      .where(and(eq(executions.triggerEventId, runId), eq(executions.workflowId, workflow.id)))

    return {
      workflowId: workflow.id,
      finalContext: context,
    }
  },
})
