import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js'
import { createServerFn } from '@tanstack/react-start'
import { polarClient } from '@/lib/polar'
import { getSession } from '@/utils/get-session'

type SubscribedUserResult =
  | {
      success: true
      data: { userSession: Awaited<ReturnType<typeof getSession>>; customer: CustomerState }
    }
  | { success: false; code: 'UNAUTHORIZED' | 'FORBIDDEN'; message: string }

export const activeSubscribedUser = createServerFn().handler(
  async (): Promise<SubscribedUserResult> => {
    const userSession = await getSession()

    if (!userSession) {
      return {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'User must be logged in',
      }
    }

    const customer = await polarClient.customers.getStateExternal({
      externalId: userSession.user.id,
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
        userSession,
        customer,
      },
    }
  },
)
