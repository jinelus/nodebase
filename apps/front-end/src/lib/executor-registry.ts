import { NODETYPE } from '@/components/node-component'
import { httpRequestExecutor } from '@/features/executions/http-request/executor'
import { manualTriggerExecutor } from '@/features/triggers/manual-trigger/executor'
import type { NodeExecutor, NodeType } from '@/utils/types'

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NODETYPE.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NODETYPE.INITIAL]: manualTriggerExecutor,
  [NODETYPE.HTTP_REQUEST]: httpRequestExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type]

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`)
  }

  return executor
}
