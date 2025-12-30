import { createOpenAI } from '@ai-sdk/openai'
import { AbortTaskRunError } from '@trigger.dev/sdk'
import { generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import Handlebars from 'handlebars'
import { db } from '@/db/connection'
import { credentials } from '@/db/schemas/credentials'
import { decrypt } from '@/utils/fn'
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
  credentialId?: string
}

export const openaiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  taskContext,
  userId,
}) => {
  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for OpenAi node: ${nodeId}`)
  }

  const result = await taskContext.run('openai', async () => {
    if (!data.model) {
      throw new AbortTaskRunError(`No model provided for OpenAi node: ${nodeId}`)
    }

    if (!data.credentialId) {
      throw new AbortTaskRunError(`No credential ID provided for OpenAi node: ${nodeId}`)
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
      throw new AbortTaskRunError(`Credential not found for OpenAI node: ${nodeId}`)
    }

    const valueDecrypted = await decrypt(credential.value)

    const openai = createOpenAI({
      apiKey: valueDecrypted,
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
