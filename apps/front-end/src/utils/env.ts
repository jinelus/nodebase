import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.string().optional(),
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_SUCCESS_URL: z.string().optional(),
    POLAR_SERVER: z.enum(['production', 'sandbox']).default('sandbox'),
    POLAR_PRODUCT_ID: z.string(),
    NGROK_URL: z.url().optional(),
    PUSHER_APP_ID: z.string({ error: 'PUSHER_APP_ID is required' }),
    PUSHER_KEY: z.string({ error: 'PUSHER_KEY is required' }),
    PUSHER_SECRET: z.string({ error: 'PUSHER_SECRET is required' }),
    PUSHER_CLUSTER: z.string({ error: 'PUSHER_CLUSTER is required' }),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().default(''),
    OPENAI_API_KEY: z.string().default(''),
    ANTHROPIC_API_KEY: z.string().default(''),
    XAI_API_KEY: z.string().default(''),
    DEEPSEEK_API_KEY: z.string().default(''),
    ENCRYPTION_KEY: z.string().default(''),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_BETTER_AUTH_URL: z.string().optional(),
    VITE_NGROK_URL: z.url().optional(),
    VITE_PUSHER_KEY: z.string().default('f8e035c341931b92f349'),
    VITE_PUSHER_CLUSTER: z.string().default('us2'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
