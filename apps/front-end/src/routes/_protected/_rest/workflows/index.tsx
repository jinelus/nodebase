import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { Suspense } from 'react'
import { WorkflowContainer } from '@/components/sections/workflow'
import { useGetWorkflows } from '@/data/hooks/use-workflows'

const parentRoute = getRouteApi('/_protected')

export const Route = createFileRoute('/_protected/_rest/workflows/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(useGetWorkflows())
  },
  pendingComponent: () => <div>Loading workflows...</div>,
})

function RouteComponent() {
  const { authSession } = parentRoute.useLoaderData()

  const { data: workflows } = useSuspenseQuery(useGetWorkflows())

  return (
    <WorkflowContainer>
      <h1>Name:</h1>
      <div> {`Hello ${authSession?.user.name}`}</div>
      Workflows
      <Suspense fallback={<div>Streaming workflows...</div>}>
        <pre>{JSON.stringify(workflows, null, 2)}</pre>
      </Suspense>
    </WorkflowContainer>
  )
}
