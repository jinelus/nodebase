import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import Handlebars from 'handlebars'
import { db } from '@/db/connection'
import { credentials } from '@/db/schemas/credentials'
import { WorkflowError } from '@/utils/errors'
import { decrypt } from '@/utils/fn'
import type { NodeExecutor } from '@/utils/types'
import type { AvailableModels } from './dialog'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type DeepseekData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
  credentialId?: string
}

export const deepseekExecutor: NodeExecutor<DeepseekData> = async ({
  data,
  nodeId,
  context,
  taskContext,
  userId,
}) => {
  if (!data.variableName) {
    throw new WorkflowError(`No variable name provided for Deepseek node: ${nodeId}`)
  }

  const result = await taskContext.run('deepseek', async () => {
    if (!data.model) {
      throw new WorkflowError(`No model provided for Deepseek node: ${nodeId}`)
    }

    if (!data.credentialId) {
      throw new WorkflowError(`No credential ID provided for Deepseek node: ${nodeId}`)
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
      throw new WorkflowError(`Credential not found for Deepseek node: ${nodeId}`)
    }

    const valueDecrypted = await decrypt(credential.value)

    const deepseek = createDeepSeek({
      apiKey: valueDecrypted,
    })

    const { text } = await generateText({
      model: deepseek(data.model),
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
        deepseekResponse: text,
      },
    }
  })

  return result
}
