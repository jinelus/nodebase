import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'
import { WorkflowContainer, WorkflowLoading, WorkflowsList } from '@/components/sections/workflow'
import { useGetWorkflows } from '@/data/hooks/use-workflows'
import { workflowsParams } from '@/utils/params'

// const parentRoute = getRouteApi('/_protected')

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
  const { page, perPage, search } = Route.useSearch()

  const { data, isPending } = useQuery(
    useGetWorkflows({
      page,
      perPage,
      search,
    }),
  )

  return (
    <WorkflowContainer>
      {isPending ? <WorkflowLoading /> : <WorkflowsList data={data?.workflows} />}
    </WorkflowContainer>
  )
}
