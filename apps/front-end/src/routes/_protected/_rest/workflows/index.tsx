import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'
import { Suspense } from 'react'
import { WorkflowContainer } from '@/components/sections/workflow'
import { useGetWorkflows } from '@/data/hooks/use-workflows'
import { workflowsParams } from '@/utils/params'

const parentRoute = getRouteApi('/_protected')

export const Route = createFileRoute('/_protected/_rest/workflows/')({
  component: RouteComponent,
  validateSearch: createStandardSchemaV1(workflowsParams, {
    partialOutput: true,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(useGetWorkflows(deps))
  },
  pendingComponent: () => <div>Loading workflows...</div>,
})

function RouteComponent() {
  const { authSession } = parentRoute.useLoaderData()

  const { page, perPage, search } = Route.useSearch()

  const { data } = useSuspenseQuery(
    useGetWorkflows({
      page,
      perPage,
      search,
    }),
  )

  return (
    <WorkflowContainer>
      <h1>Name:</h1>
      <div> {`Hello ${authSession?.user.name}`}</div>
      Workflows
      <Suspense fallback={<div>Streaming workflows...</div>}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Suspense>
    </WorkflowContainer>
  )
}
