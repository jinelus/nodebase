import { AbortTaskRunError } from '@trigger.dev/sdk'
import ky, { type Options as KyOptions } from 'ky'
import type { NodeExecutor } from '@/utils/types'

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
    const endpoint = data.endpoint as string

    const method = data.method || 'GET'

    const options: KyOptions = { method }

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      options.body = data.body
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
