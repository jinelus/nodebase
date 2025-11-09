import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://b3093d2d7725c1cefe500022fd8db27b@o4510332248653824.ingest.us.sentry.io/4510332354756608',
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
    // Sentry.tanstackRouterBrowserTracingIntegration(),
    // Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'info', 'error'],
    }),
  ],

  tracesSampleRate: 1.0,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,
})
