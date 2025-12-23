import type { NodeExecutor } from '@/utils/types'

type StripeData = Record<string, unknown>

export const stripeExecutor: NodeExecutor<StripeData> = async ({ context, taskContext }) => {
  const result = taskContext.run('stripe-trigger', async () => context)

  return result
}
