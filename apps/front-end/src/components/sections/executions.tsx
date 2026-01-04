import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircleIcon, ClockIcon, Loader2Icon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useGetExecutions } from '@/data/hooks/use-executions'
import { useExecutionsParams } from '@/data/hooks/use-workflows-params'
import type { ExecutionsSelect } from '@/utils/types'
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  LoadingView,
} from '../entity-components'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'

dayjs.extend(relativeTime)

export const ExecutionsHeader: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  return (
    <EntityHeader
      title="Executions"
      description="Here your history of workflows executions."
      disabled={disabled}
    />
  )
}

export const ExecutionsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EntityContainer header={<ExecutionsHeader />} pagination={<ExecutionsPagination />}>
      {children}
    </EntityContainer>
  )
}

export const ExecutionsPagination = () => {
  const [params, setParams] = useExecutionsParams()
  const executions = useSuspenseQuery(useGetExecutions(params))

  const handlePageChange = (newPage: number) => {
    setParams((prev) => {
      return { ...prev, page: newPage }
    })
  }

  return (
    <EntityPagination
      page={executions.data.currentPage}
      totalPages={executions.data.totalPages}
      onPageChange={handlePageChange}
      disabled={executions.isPending}
    />
  )
}

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions..." />
}

export const ExecutionsEmptyState = () => {
  return <EmptyView message="You haven't created any executions yet." />
}

export const ExecutionsList = ({
  data,
}: {
  data?: Array<ExecutionsSelect & { workflow: { id: string; name: string } }>
}) => {
  return (
    <EntityList
      items={data ?? []}
      emptyView={<ExecutionsEmptyState />}
      renderItem={(execution) => <ExecutionsItem execution={execution} />}
      getKey={(execution) => execution.id}
      className="flex-1"
    />
  )
}

const getStatusIcon = (status: ExecutionsSelect['status']) => {
  switch (status) {
    case 'SUCCESS':
      return <CheckCircleIcon className="size-5 text-green-500" />
    case 'FAILED':
      return <XCircleIcon className="size-5 text-red-500" />
    case 'RUNNING':
      return <Loader2Icon className="size-5 animate-spin text-blue-500" />
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />
  }
}

const formatStatus = (status: ExecutionsSelect['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export const ExecutionsItem: React.FC<{
  execution: ExecutionsSelect & { workflow: { id: string; name: string } }
}> = ({ execution }) => {
  const duration = execution.completedAt
    ? dayjs(execution.completedAt).diff(dayjs(execution.startedAt), 'second')
    : null

  const subtitle = (
    <>
      {execution.workflow.name} &bull; Started {dayjs(execution.startedAt).fromNow()}
      {duration !== null && <> &bull; Took: {duration}s</>}
    </>
  )

  return (
    <EntityItem
      title={formatStatus(execution.status)}
      href={`/executions/${execution.id}`}
      subtitle={subtitle}
      image={
        <div className="flex size-8 items-center justify-center">
          {getStatusIcon(execution.status)}
        </div>
      }
    />
  )
}

export const ExecutionsView = ({
  execution,
}: {
  execution: ExecutionsSelect & { workflow: { id: string; name: string } }
}) => {
  const duration = execution?.completedAt
    ? dayjs(execution.completedAt).diff(dayjs(execution.startedAt), 'second')
    : null

  const [showErrorStack, setShowErrorStack] = useState(false)

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="space-y-2">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>Execution for {execution.workflow.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-muted-foreground text-sm">Workflow</p>
            <Link
              to={`/workflows/$workflowId`}
              params={{ workflowId: execution.workflow.id }}
              preload="intent"
              className="text-blue-500 hover:underline"
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="font-medium text-muted-foreground text-sm">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground text-sm">Started</p>
            <p className="text-sm">{dayjs(execution.startedAt).fromNow()}</p>
          </div>

          {execution.completedAt ? (
            <div>
              <p className="font-medium text-muted-foreground text-sm">Completed</p>
              <p className="text-sm">{dayjs(execution.completedAt).fromNow()}</p>
            </div>
          ) : null}

          {duration !== null && (
            <div>
              <p className="font-medium text-muted-foreground text-sm">Duration</p>
              <p className="text-sm">{duration}s</p>
            </div>
          )}

          <div>
            <p className="font-medium text-muted-foreground text-sm">Event ID</p>
            <p className="text-sm">{execution.triggerEventId}</p>
          </div>
        </div>
        {execution.error && (
          <div className="mt-6 space-y-3 rounded-md bg-red-50 p-4">
            <div>
              <p className="mb-2 font-medium text-red-900 text-sm">Error</p>
              <p className="font-mono text-red-800 text-sm">{execution.error}</p>
            </div>
            {execution.errorStack && (
              <Collapsible open={showErrorStack} onOpenChange={setShowErrorStack}>
                <CollapsibleTrigger>
                  <Button variant={'ghost'} size={'sm'} className="text-red-900">
                    {showErrorStack ? 'Hide Error Stack' : 'Show Error Stack'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 font-mono text-red-800 text-xs">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {typeof execution.output === 'object' && execution.output !== null && (
          <div className="mt-6 rounded-md bg-muted p-4">
            <p className="mb-2 font-medium text-sm">Output</p>
            <pre className="mt-2 overflow-auto rounded bg-background p-2 font-mono text-xs">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
