import { createServerFn } from '@tanstack/react-start'
import { backgroundIAProvider } from '@/lib/trigger/example'

export const aiProvider = createServerFn({ method: 'GET' })
  .inputValidator((data: { prompt: string }) => data)
  .handler(async ({ data }) => {
    return await backgroundIAProvider.trigger({ prompt: data.prompt })
  })
