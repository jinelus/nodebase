import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_URL: z.string().optional(),
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_SUCCESS_URL: z.string().optional(),
    POLAR_SERVER: z.enum(['production', 'sandbox']).default('sandbox'),
    NGROK_URL: z.string().url().optional(),
    PUSHER_APP_ID: z.string().optional(),
    PUSHER_KEY: z.string().optional(),
    PUSHER_SECRET: z.string().optional(),
    PUSHER_CLUSTER: z.string().optional(),
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
