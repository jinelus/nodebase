import { AbortTaskRunError } from '@trigger.dev/sdk'
import Handlebars from 'handlebars'
import ky, { type Options as KyOptions } from 'ky'
import type { NodeExecutor } from '@/utils/types'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type HttpRequestData = {
  variableName?: string
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  taskContext,
}) => {
  if (!data.endpoint) {
    throw new AbortTaskRunError(`No endpoint provided for HTTP Request node: ${nodeId}`)
  }

  if (!data.variableName) {
    throw new AbortTaskRunError(`No variable name provided for HTTP Request node: ${nodeId}`)
  }

  // TODO: Publish loading state to the taskContext logger

  const result = await taskContext.run('http-request', async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context)

    const method = data.method || 'GET'

    const options: KyOptions = { method }

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      const resolvedBody = Handlebars.compile(data.body ?? '{}')(context)
      JSON.parse(resolvedBody) // Validate JSON
      options.body = resolvedBody
      options.headers = {
        'Content-Type': 'application/json',
      }
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get('content-type')
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    return {
      ...context,
      [data.variableName as string]: {
        httpRequestResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      },
    }
  })

  // TODO: Publish success state to the taskContext logger

  return result
}
