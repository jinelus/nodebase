import type { NodeExecutor } from '@/utils/types'

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  taskContext,
}) => {
  const result = taskContext.run('manual-trigger', async () => context)

  return result
}
