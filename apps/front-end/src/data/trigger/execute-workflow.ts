import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { db } from '@/db/connection'
import { executeWorkflow } from '@/lib/trigger/functions'

const inputValuesSchema = z.object({
  workflowId: z.string(),
  initialData: z.record(z.string(), z.unknown()).optional(),
})

export const executeWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => inputValuesSchema.parse(data))
  .handler(async ({ data }) => {
    const workflow = await db.query.workflows.findFirst({
      where: (workflows, { eq }) => eq(workflows.id, data.workflowId),
    })

    if (!workflow) {
      throw new Error('Workflow not found')
    }

    await executeWorkflow.trigger({ workflowId: workflow.id, initialData: data.initialData })

    return workflow
  })
