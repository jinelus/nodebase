import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db/connection'
import { executeWorkflow } from '@/lib/trigger/functions'

export const executeWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { workflowId: string }) => data)
  .handler(async ({ data }) => {
    const workflow = await db.query.workflows.findFirst({
      where: (workflows, { eq }) => eq(workflows.id, data.workflowId),
    })

    if (!workflow) {
      throw new Error('Workflow not found')
    }

    await executeWorkflow.trigger({ workflowId: workflow.id })

    return workflow
  })
