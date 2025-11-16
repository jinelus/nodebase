import { wrapCreateRootRouteWithSentry } from '@sentry/tanstackstart-react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import appCss from '../styles.css?url'

export const Route = wrapCreateRootRouteWithSentry(
  createRootRouteWithContext<{
    queryClient: QueryClient
  }>,
)()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
        precedence: 'default',
      },
    ],
  }),

  shellComponent: RootDocument,
})

const queryClient = new QueryClient()

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <HeadContent />

      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider enableSystem attribute={'class'}>
            <div className="min-h-screen px-6">{children}</div>
            <Toaster position="top-right" richColors />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Scripts />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
