import type { NodeExecutor } from '@/utils/types'

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  taskContext,
}) => {
  // TODO: Publish loading state to the taskContext logger

  const result = taskContext.run('manual-trigger', async () => context)

  // TODO: Publish success state to the taskContext logger

  return result
}
