import { createServerFn } from '@tanstack/react-start'
import { polarClient } from '@/lib/polar'
import { authMiddleware } from '@/routes/_protected'
import type { getSession } from '@/utils/get-session'

type SubscribedUserResult =
  | {
      success: true
      data: {
        userSession: NonNullable<Awaited<ReturnType<typeof getSession>>>
      }
    }
  | { success: false; code: 'UNAUTHORIZED' | 'FORBIDDEN'; message: string }

export const activeSubscribedUser = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SubscribedUserResult> => {
    if (!context.session) {
      return {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'User must be logged in',
      }
    }

    const customer = await polarClient.customers.getStateExternal({
      externalId: context.session.user.id,
    })

    if (!customer?.activeSubscriptions || customer?.activeSubscriptions?.length === 0) {
      return {
        success: false,
        code: 'FORBIDDEN',
        message: 'Active subscription required',
      }
    }

    return {
      success: true,
      data: {
        userSession: context.session,
      },
    }
  })

export const activeSubscription = createServerFn()
  .middleware([authMiddleware])
  .handler(
    async ({
      context,
    }): Promise<
      { success: true } | { success: false; code: 'UNAUTHORIZED' | 'FORBIDDEN'; message: string }
    > => {
      if (!context.session) {
        return {
          success: false,
          code: 'UNAUTHORIZED',
          message: 'User must be logged in',
        }
      }

      const customer = await polarClient.customers.getStateExternal({
        externalId: context.session.user.id,
      })

      if (!customer?.activeSubscriptions || customer?.activeSubscriptions?.length === 0) {
        return {
          success: false,
          code: 'FORBIDDEN',
          message: 'Active subscription required',
        }
      }

      return {
        success: true,
      }
    },
  )
