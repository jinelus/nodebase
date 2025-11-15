import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_rest/executions/$executionId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { executionId } = Route.useParams()
  return <div>Hello "/_protected/_rest/executions/{executionId}"!</div>
}
