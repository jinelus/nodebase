import { createAnthropic } from '@ai-sdk/anthropic'
import { AbortTaskRunError } from '@trigger.dev/sdk'
import { generateText } from 'ai'
import Handlebars from 'handlebars'
import { env } from '@/utils/env'
import type { NodeExecutor } from '@/utils/types'
import type { AvailableModels } from './dialog'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type AnthropicData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
}

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for Anthropic node: ${nodeId}`)
  }

  const result = await taskContext.run('anthropic', async () => {
    if (!data.model) {
      throw new AbortTaskRunError(`No model provided for Anthropic node: ${nodeId}`)
    }

    const systemPromptTemplate = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : 'You are a helpful assistant.'
    const userPromptTemplate = Handlebars.compile(data.userPrompt)(context)

    const credentialValue = env.ANTHROPIC_API_KEY

    const anthropic = createAnthropic({
      apiKey: credentialValue, // TODO: handle user API keys
    })

    const { text } = await generateText({
      model: anthropic(data.model),
      prompt: userPromptTemplate,
      system: systemPromptTemplate,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    })

    return {
      ...context,
      [data.variableName as string]: {
        anthropicResponse: text,
      },
    }
  })

  return result
}
