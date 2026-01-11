import { createServerFn } from '@tanstack/react-start'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db/connection'
import { workflows } from '@/db/schemas'
import { executions } from '@/db/schemas/executions'
import { activeSubscribedUser } from '@/features/subscriptions/active-subscribed-user'
import { authMiddleware } from '@/routes/_protected'
import type { PaginationParams } from '@/utils/pagination'

const createExecutionSchema = z.object({
  workflowId: z.string(),
  triggerEventId: z.string(),
  completedAt: z.date().nullable(),
  error: z.string().nullable(),
  errorStack: z.string().nullable(),
  status: z.enum(['RUNNING', 'SUCCESS', 'FAILED']),
  output: z.record(z.string(), z.any()).nullable(),
})

type CreateExecutionInput = z.infer<typeof createExecutionSchema>

export const createExecutionFn = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateExecutionInput) => createExecutionSchema.parse(data))
  .handler(async ({ data }) => {
    const authUser = await activeSubscribedUser()

    if (!authUser.success) {
      throw new Error(`${authUser.code}: ${authUser.message}`)
    }

    const [execution] = await db
      .insert(executions)
      .values({
        workflowId: data.workflowId,
        triggerEventId: data.triggerEventId,
        completedAt: data.completedAt,
        error: data.error,
        errorStack: data.errorStack,
        status: data.status,
        output: data.output,
      })
      .returning()

    return {
      ...execution,
      output: execution.output ?? null,
    }
  })

export const updateExecutionFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Partial<CreateExecutionInput> & { id: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await activeSubscribedUser()

    if (!authUser.success) {
      throw new Error(`${authUser.code}: ${authUser.message}`)
    }

    const [existing] = await db.select().from(executions).where(eq(executions.id, data.id))

    if (!existing) {
      throw new Error(JSON.stringify({ success: false, message: 'Execution not found' }))
    }

    const [updatedExecution] = await db
      .update(executions)
      .set({
        completedAt: data.completedAt ?? existing.completedAt,
        error: data.error ?? existing.error,
        errorStack: data.errorStack ?? existing.errorStack,
        status: data.status ?? existing.status,
        output: data.output ?? existing.output,
      })
      .where(eq(executions.id, data.id))
      .returning()

    return {
      ...updatedExecution,
      output: updatedExecution.output ?? null,
    }
  })

export const getExecutionByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: id }) => {
    const authUser = await activeSubscribedUser()

    if (!authUser.success) {
      throw new Error(`${authUser.code}: ${authUser.message}`)
    }

    const [execution] = await db.select().from(executions).where(eq(executions.id, id))

    if (!execution) {
      throw new Error('Execution not found')
    }

    const [workflow] = await db
      .select({ name: workflows.name, id: workflows.id })
      .from(workflows)
      .where(eq(workflows.id, execution.workflowId))

    return {
      ...execution,
      output: execution.output ?? null,
      workflow,
    }
  })

export const getExecutionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ data, context }) => {
    if (!context.session.user.id) {
      return {
        executions: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }

    const { page, perPage } = data ?? {}

    const executionsList = await db.query.executions.findMany({
      limit: perPage,
      offset: page && perPage ? (page - 1) * perPage : undefined,
      orderBy: (execution, { desc }) => [desc(execution.startedAt)],
    })

    const [{ total }] = await db.select({ total: count() }).from(executions)

    const totalPages = perPage ? Math.ceil(total / perPage) : 1
    const currentPage = page ?? 1
    const hasNextPage = perPage ? currentPage < totalPages : false
    const hasPreviousPage = perPage ? currentPage > 1 : false

    const allExecutionsWithNames = await Promise.all(
      executionsList.map(async (execution) => {
        const [workflow] = await db
          .select({ name: workflows.name, id: workflows.id })
          .from(workflows)
          .where(eq(workflows.id, execution.workflowId))

        return {
          ...execution,
          output: execution.output ?? null,
          workflow,
        }
      }),
    )

    return {
      executions: allExecutionsWithNames,
      totalPages,
      total,
      currentPage,
      hasNextPage,
      hasPreviousPage,
    }
  })
