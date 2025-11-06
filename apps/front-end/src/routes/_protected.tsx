import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

const authMiddleware = createMiddleware().server(async ({ request, next }) => {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: `/login?redirect=${encodeURIComponent(new URL(request.url).pathname)}`,
      },
    })
  }

  return next({
    context: {
      session,
    },
  })
})

export const Route = createFileRoute('/_protected')({
  server: {
    middleware: [authMiddleware],
  },
  loader: async ({ serverContext }) => {
    return {
      authSession: serverContext?.session,
    }
  },
  component: () => <Outlet />,
})
