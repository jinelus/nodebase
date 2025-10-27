import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './generated-route-tree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App
