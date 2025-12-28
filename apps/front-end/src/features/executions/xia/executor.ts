import { createXai } from '@ai-sdk/xai'
import { AbortTaskRunError } from '@trigger.dev/sdk'
import { generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import Handlebars from 'handlebars'
import { db } from '@/db/connection'
import { credentials } from '@/db/schemas/credentials'
import type { NodeExecutor } from '@/utils/types'
import type { AvailableModels } from './dialog'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type GrokData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
  credentialId?: string
}

export const grokExecutor: NodeExecutor<GrokData> = async ({
  data,
  nodeId,
  context,
  taskContext,
  userId,
}) => {
  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for Grok node: ${nodeId}`)
  }

  const result = await taskContext.run('grok', async () => {
    if (!data.model) {
      throw new AbortTaskRunError(`No model provided for Grok node: ${nodeId}`)
    }

    if (!data.credentialId) {
      throw new AbortTaskRunError(`No credential ID provided for Grok node: ${nodeId}`)
    }

    const systemPromptTemplate = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : 'You are a helpful assistant.'
    const userPromptTemplate = Handlebars.compile(data.userPrompt)(context)

    const [credential] = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.id, data.credentialId), eq(credentials.userId, userId)))

    if (!credential) {
      throw new AbortTaskRunError(`Credential not found for Gemini node: ${nodeId}`)
    }

    const xai = createXai({
      apiKey: credential.value,
    })

    const { text } = await generateText({
      model: xai(data.model),
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
        grokResponse: text,
      },
    }
  })

  return result
}
