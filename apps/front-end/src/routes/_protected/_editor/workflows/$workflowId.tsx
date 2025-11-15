import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_editor/workflows/$workflowId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workflowId } = Route.useParams()

  return <div>Hello "/_protected/_editor/workflows/{workflowId}"!</div>
}
