import { NODETYPE } from '@/components/node-component'
import { httpRequestExecutor } from '@/features/executions/http-request/executor'
import { googleFormExecutor } from '@/features/triggers/google-form/executor'
import { manualTriggerExecutor } from '@/features/triggers/manual-trigger/executor'
import { stripeExecutor } from '@/features/triggers/stripe/executor'
import type { NodeExecutor, NodeType } from '@/utils/types'

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NODETYPE.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NODETYPE.INITIAL]: manualTriggerExecutor,
  [NODETYPE.HTTP_REQUEST]: httpRequestExecutor,
  [NODETYPE.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
  [NODETYPE.STRIPE_TRIGGER]: stripeExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type]

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`)
  }

  return executor
}
