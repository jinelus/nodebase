import { AbortTaskRunError } from '@trigger.dev/sdk'
import Handlebars from 'handlebars'
import { decode } from 'html-entities'
import ky, { type Options as KyOptions } from 'ky'
import type { NodeExecutor } from '@/utils/types'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type DiscordData = {
  variableName?: string
  webhookUrl?: string
  content?: string
  username?: string
}

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  const result = await taskContext.run('http-request', async () => {
    if (!data.webhookUrl) {
      throw new AbortTaskRunError(`No webhook URL provided for Discord node: ${nodeId}`)
    }

    if (!data.variableName) {
      throw new AbortTaskRunError(`No variable name provided for Discord node: ${nodeId}`)
    }
    const rawContent = Handlebars.compile(data.content)(context)

    const content = decode(rawContent)

    const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined

    await ky.post(data.webhookUrl, {
      json: {
        content: content.slice(0, 2000), // Discord has a max message length characters
        username,
      },
    } as KyOptions)

    return {
      ...context,
      [data.variableName as string]: {
        discordResponse: {
          data: {
            messageSended: true,
          },
        },
      },
    }
  })

  return result
}
