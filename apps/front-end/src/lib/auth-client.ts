import { polarClient } from '@polar-sh/better-auth'
import { createAuthClient } from 'better-auth/react'
import { env } from '@/utils/env'

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [polarClient()],
})
