import { createGoogleGenerativeAI } from '@ai-sdk/google'
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

type GeminiData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
}

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for Gemini node: ${nodeId}`)
  }

  const result = await taskContext.run('gemini', async () => {
    if (!data.model) {
      throw new AbortTaskRunError(`No model provided for Gemini node: ${nodeId}`)
    }

    const systemPromptTemplate = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : 'You are a helpful assistant.'
    const userPromptTemplate = Handlebars.compile(data.userPrompt)(context)

    const credentialValue = env.GOOGLE_GENERATIVE_AI_API_KEY

    const google = createGoogleGenerativeAI({
      apiKey: credentialValue, // TODO: handle user API keys
    })

    const { text } = await generateText({
      model: google(data.model),
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
        geminiResponse: text,
      },
    }
  })

  return result
}
