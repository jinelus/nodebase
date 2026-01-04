import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'
import {
  ExecutionsContainer,
  ExecutionsList,
  ExecutionsLoading,
} from '@/components/sections/executions'
import { useGetExecutions } from '@/data/hooks/use-executions'
import { executionsParams } from '@/utils/params'

export const Route = createFileRoute('/_protected/_rest/executions/')({
  component: RouteComponent,
  validateSearch: createStandardSchemaV1(executionsParams, {
    partialOutput: true,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(useGetExecutions(deps))
  },
  pendingComponent: () => <div>Loading executions...</div>,
})

function RouteComponent() {
  const { page, perPage } = Route.useSearch()

  const { data, isPending } = useQuery(
    useGetExecutions({
      page,
      perPage,
    }),
  )

  return (
    <ExecutionsContainer>
      {isPending ? <ExecutionsLoading /> : <ExecutionsList data={data?.executions ?? []} />}
    </ExecutionsContainer>
  )
}
