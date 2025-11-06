import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const parentRoute = getRouteApi('/_protected')

export const Route = createFileRoute('/_protected/')({
  component: Home,
})

function Home() {
  const { authSession } = parentRoute.useLoaderData()
  return <div>Welcome!{JSON.stringify(authSession, null, 2)} </div>
}
