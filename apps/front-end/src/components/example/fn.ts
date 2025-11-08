import { createServerFn } from '@tanstack/react-start'
import { helloWorld } from '@/lib/trigger/example'

export const triggerServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    return await helloWorld.trigger({
      name: data.name || 'World',
    })
  })
