import * as Sentry from '@sentry/tanstackstart-react'
import React from 'react'

// biome-ignore lint/style/useReactFunctionComponents: <!-- Ignore -->
class MyErrorBoundary extends React.Component {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }
}
export const MySentryWrappedErrorBoundary = Sentry.withErrorBoundary(MyErrorBoundary, {
  // ... sentry error wrapper options
  dialogOptions: {
    title: 'Something went wrong',
    subtitle: 'Our team has been notified.',
    lang: 'en',
  },
})
