import Handlebars from 'handlebars'
import { decode } from 'html-entities'
import ky, { type Options as KyOptions } from 'ky'
import { WorkflowError } from '@/utils/errors'
import type { NodeExecutor } from '@/utils/types'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type SlackData = {
  variableName?: string
  webhookUrl?: string
  content?: string
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  const result = await taskContext.run('http-request', async () => {
    if (!data.webhookUrl) {
      throw new WorkflowError(`No webhook URL provided for Slack node: ${nodeId}`)
    }

    if (!data.variableName) {
      throw new WorkflowError(`No variable name provided for Slack node: ${nodeId}`)
    }
    const rawContent = Handlebars.compile(data.content)(context)

    const content = decode(rawContent)

    await ky.post(data.webhookUrl, {
      json: {
        text: content,
      },
    } as KyOptions)

    return {
      ...context,
      [data.variableName as string]: {
        slackResponse: {
          data: {
            messageSent: true,
          },
        },
      },
    }
  })

  return result
}
