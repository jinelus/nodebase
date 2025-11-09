import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { task, wait } from '@trigger.dev/sdk'
import { generateText } from 'ai'

const google = createGoogleGenerativeAI()

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

export const backgroundIAProvider = task({
  id: 'background-ai-provider',
  run: async (payload: { prompt: string }) => {
    // Simulate calling an AI provider
    await wait.for({ seconds: 3 })

    const { text } = await generateText({
      model: google('gemini-2.5-pro'),
      prompt: payload.prompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    })

    return text
  },
})
