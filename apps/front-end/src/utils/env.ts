import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_URL: z.string().optional(),
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_SUCCESS_URL: z.string().optional(),
    POLAR_SERVER: z.enum(['production', 'sandbox']).default('sandbox'),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_BETTER_AUTH_URL: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
