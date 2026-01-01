import { NODETYPE } from '@/components/node-component'
import { anthropicExecutor } from '@/features/executions/anthropic/executor'
import { deepseekExecutor } from '@/features/executions/deepseek/executor'
import { discordExecutor } from '@/features/executions/discord/executor'
import { geminiExecutor } from '@/features/executions/gemini/executor'
import { httpRequestExecutor } from '@/features/executions/http-request/executor'
import { openaiExecutor } from '@/features/executions/openai/executor'
import { slackExecutor } from '@/features/executions/slack/executor'
import { grokExecutor } from '@/features/executions/xia/executor'
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
  [NODETYPE.GEMINI]: geminiExecutor,
  [NODETYPE.OPENAI]: openaiExecutor,
  [NODETYPE.ANTHROPIC]: anthropicExecutor,
  [NODETYPE.GROK]: grokExecutor,
  [NODETYPE.DEEPSEEK]: deepseekExecutor,
  [NODETYPE.DISCORD]: discordExecutor,
  [NODETYPE.SLACK]: slackExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type]

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`)
  }

  return executor
}
