import { createOpenAI } from '@ai-sdk/openai'
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

type OpenAiData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
}

export const openaiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for OpenAi node: ${nodeId}`)
  }

  const result = await taskContext.run('openai', async () => {
    if (!data.model) {
      throw new AbortTaskRunError(`No model provided for OpenAi node: ${nodeId}`)
    }

    const systemPromptTemplate = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : 'You are a helpful assistant.'
    const userPromptTemplate = Handlebars.compile(data.userPrompt)(context)

    const credentialValue = env.OPENAI_API_KEY

    const openai = createOpenAI({
      apiKey: credentialValue, // TODO: handle user API keys
    })

    const { text } = await generateText({
      model: openai(data.model),
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
        openaiResponse: text,
      },
    }
  })

  return result
}
