import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db/connection'
import { workflows } from '@/db/schemas'
import { activeSubscribedUser } from '@/features/subscriptions/active-subscribed-user'
import { authMiddleware } from '@/routes/_protected'

const createWorkflowSchema = z.object({
  name: z.string().max(255),
})

const updateWorkflowSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
})

export const createWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => createWorkflowSchema.parse(data))
  .handler(async ({ data }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const [workflow] = await db
      .insert(workflows)
      .values({
        name: data.name,
        userId: authResult.data.userSession.user.id,
      })
      .returning()

    return workflow
  })

export const getWorkflowsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user.id) {
      return []
    }

    const userWorkflows = await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, context.session.user.id))

    return userWorkflows
  })

export const getWorkflowByIdFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: workflowId, context }) => {
    if (!context.session?.user.id) {
      return null
    }

    const [workflow] = await db
      .select()
      .from(workflows)
      .where(and(eq(workflows.id, workflowId), eq(workflows.userId, context.session.user.id)))

    if (!workflow) {
      return null
    }

    return workflow
  })

export const updateWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => updateWorkflowSchema.parse(data))
  .handler(async ({ data }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(workflows)
      .where(
        and(eq(workflows.id, data.id), eq(workflows.userId, authResult.data.userSession.user.id)),
      )

    if (!existing) {
      throw new Error('Workflow not found or access denied')
    }

    const [updated] = await db
      .update(workflows)
      .set({
        name: data.name,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, data.id))
      .returning()

    return updated
  })

export const deleteWorkflowFn = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: workflowId }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const [existing] = await db
      .select()
      .from(workflows)
      .where(
        and(
          eq(workflows.id, workflowId),
          eq(workflows.userId, authResult.data.userSession.user.id),
        ),
      )

    if (!existing) {
      throw new Error('Workflow not found or access denied')
    }

    await db.delete(workflows).where(eq(workflows.id, workflowId))

    return { success: true, id: workflowId }
  })
