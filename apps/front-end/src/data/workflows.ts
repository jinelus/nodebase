import { createServerFn } from '@tanstack/react-start'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db/connection'
import { workflows } from '@/db/schemas'
import { activeSubscribedUser } from '@/features/subscriptions/active-subscribed-user'
import { authMiddleware } from '@/routes/_protected'
import { type PaginationParams, paginationParamsSchema } from '@/utils/pagination'

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
  .inputValidator((data?: PaginationParams) => paginationParamsSchema.parse(data))
  .handler(async ({ context, data: params }) => {
    if (!context.session?.user.id) {
      return {
        workflows: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }

    const { page, perPage, search } = params ?? {}

    const conditions = [eq(workflows.userId, context.session.user.id)]
    if (search) conditions.push(ilike(workflows.name, `%${search}%`))

    const userWorkflows = await db.query.workflows.findMany({
      where: and(...conditions),
      offset: ((page ?? 1) - 1) * (perPage ?? 10),
      limit: perPage ?? 10,
      orderBy: desc(workflows.updatedAt),
    })

    const [{ total }] = await db
      .select({ total: count() })
      .from(workflows)
      .where(and(...conditions))

    const totalPages = Math.ceil(total / (params?.perPage ?? 10))
    const hasNextPage = (params?.page ?? 1) < totalPages
    const hasPreviousPage = (params?.page ?? 1) > 1

    return {
      workflows: userWorkflows,
      totalPages,
      totalItems: total,
      currentPage: params?.page ?? 1,
      hasNextPage,
      hasPreviousPage,
    }
  })

export const getWorkflowByIdFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: workflowId, context }) => {
    if (!context.session?.user.id) {
      return null
    }

    const workflow = await db.query.workflows.findFirst({
      where: (workflow, { eq, and }) =>
        and(eq(workflow.id, workflowId), eq(workflow.userId, context.session.user.id)),
    })

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
