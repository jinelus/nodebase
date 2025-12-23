import type { NodeExecutor } from '@/utils/types'

type GoogleFormData = Record<string, unknown>

export const googleFormExecutor: NodeExecutor<GoogleFormData> = async ({
  context,
  taskContext,
}) => {
  const result = await taskContext.run('google-form-trigger', async () => context)

  return result
}
