import { AbortTaskRunError, schemaTask } from '@trigger.dev/sdk'
import z from 'zod'
import { db } from '@/db/connection'
import type { NodeType } from '@/utils/types'
import { getExecutor } from '../executor-registry'
import { createTaskContext, topologicalSort } from './utils'

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

    let context = payload?.initialData || {}

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        taskContext: createTaskContext(),
      })
    }

    return {
      workflowId: workflow.id,
      finalContext: context,
    }
  },
})
