import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/db/connection'
import { executeWorkflow } from '@/lib/trigger/functions'

const inputSchema = z.object({
  workflowId: z.string(),
  initialData: z.record(z.string(), z.unknown()).optional(),
})

export const executeWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const workflow = await db.query.workflows.findFirst({
      where: (workflows, { eq }) => eq(workflows.id, data.workflowId),
    })

    if (!workflow) {
      throw new Error('Workflow not found')
    }

    const result = await executeWorkflow.trigger({
      workflowId: workflow.id,
      initialData: data.initialData,
    })

    return {
      runId: result.id,
      accessToken: result.publicAccessToken,
    }
  })
