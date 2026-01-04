import { createFileRoute } from '@tanstack/react-router'
import { LoadingView } from '@/components/entity-components'
import { ExecutionsView } from '@/components/sections/executions'
import { useGetExecution } from '@/data/hooks/use-executions'

export const Route = createFileRoute('/_protected/_rest/executions/$executionId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { executionId } = Route.useParams()
  const { data, isPending } = useGetExecution(executionId)

  return (
    <div className="h-full w-full overflow-x-hidden p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full flex-col gap-y-8">
        {isPending ? (
          <LoadingView message="Loading execution..." />
        ) : data ? (
          <ExecutionsView execution={data} />
        ) : (
          <div>Execution not found.</div>
        )}
      </div>
    </div>
  )
}
