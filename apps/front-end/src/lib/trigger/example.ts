import { task, wait } from '@trigger.dev/sdk'

export const helloWorld = task({
  id: 'hello-world',
  run: async (payload: { name: string }) => {
    console.log(`Hello ${payload.name}!`)

    await wait.for({ seconds: 5 })

    return {
      message: `Hello ${payload.name}!`,
      timestamp: new Date().toISOString(),
    }
  },
})
