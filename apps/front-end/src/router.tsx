import * as Sentry from '@sentry/tanstackstart-react'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <div>404: Page Not Found</div>,
  })

  if (!router.isServer) {
    Sentry.init({
      dsn: 'https://b3093d2d7725c1cefe500022fd8db27b@o4510332248653824.ingest.us.sentry.io/4510332354756608',
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      integrations: [
        // Sentry.tanstackRouterBrowserTracingIntegration,
        Sentry.replayIntegration(),
        Sentry.consoleLoggingIntegration({
          levels: ['log', 'info', 'error'],
        }),
        // vercelAIIntegration({
        //   recordInputs: true,
        //   recordOutputs: true,
        // }),
      ],
      sendDefaultPii: true,
      tracesSampleRate: 1.0,

      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      enableLogs: true,
    })
  }

  return router
}
