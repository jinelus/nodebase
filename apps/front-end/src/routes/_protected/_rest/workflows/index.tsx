import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const parentRoute = getRouteApi('/_protected')

export const Route = createFileRoute('/_protected/_rest/workflows/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { authSession } = parentRoute.useLoaderData()

  return <div> {`Hello ${authSession?.user.name}`}</div>
}
