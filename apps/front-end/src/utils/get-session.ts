import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export async function getSession() {
  const response = await auth.api.getSession({
    headers: getRequest().headers,
  })

  if (!response) {
    redirect({ to: '/login' })
    return null
  }

  return {
    session: response.session,
    user: response.user,
  }
}
