import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_rest/credentials/$credentialId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { credentialId } = Route.useParams()
  return <div>Hello "/_protected/_rest/credentials/{credentialId}"!</div>
}
