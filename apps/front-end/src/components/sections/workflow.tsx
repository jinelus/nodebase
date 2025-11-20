import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { WorkflowIcon } from 'lucide-react'
import { useCreateWorkflow, useDeleteWorkflow, useGetWorkflows } from '@/data/hooks/use-workflows'
import { useWorkflowsParams } from '@/data/hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import type { WorkflowSelect } from '@/utils/types'
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  LoadingView,
} from '../entity-components'

dayjs.extend(relativeTime)

export const WorkflowHeader: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const router = useRouter()

  const createWorkflow = useCreateWorkflow()

  const { handleError, modal } = useUpgradeModal()

  const handleCreate = () => {
    createWorkflow.mutate(
      { name: 'New Workflow' },
      {
        onSuccess: (data) => {
          router.navigate({ to: `/workflows/${data.id}` })
        },
        onError: (error) => {
          handleError(error)
          console.error('Failed to create workflow')
        },
      },
    )
  }

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        newButtonLabel="New Workflow"
        description="Create and manage your workflows"
        disabled={disabled}
        isCreating={false}
        onNewClick={handleCreate}
      />
    </>
  )
}

export const WorkflowContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      pagination={<WorkflowsPagination />}
      search={<WorkflowsSearch />}
    >
      {children}
    </EntityContainer>
  )
}

export const WorkflowsSearch = () => {
  const [{ page, search }, setParams] = useWorkflowsParams()

  const { searchValue, setSearchValue } = useEntitySearch({
    params: { page, search },
    setParams,
    debounceTime: 500,
  })

  return (
    <EntitySearch value={searchValue} onChange={setSearchValue} placeholder="Search Workflows" />
  )
}

export const WorkflowsPagination = () => {
  const [params, setParams] = useWorkflowsParams()
  const workflows = useSuspenseQuery(useGetWorkflows(params))

  const handlePageChange = (newPage: number) => {
    setParams((prev) => {
      return { ...prev, page: newPage }
    })
  }

  return (
    <EntityPagination
      page={workflows.data.currentPage}
      totalPages={workflows.data.totalPages}
      onPageChange={handlePageChange}
      disabled={workflows.isPending}
    />
  )
}

export const WorkflowLoading = () => {
  return <LoadingView message="Loading workflows..." />
}

export const WorkflowsEmptyState = () => {
  const router = useRouter()

  const createWorkflow = useCreateWorkflow()

  const { handleError, modal } = useUpgradeModal()

  const handleCreate = () => {
    createWorkflow.mutate(
      { name: 'New Workflow' },
      {
        onSuccess: (data) => {
          router.navigate({ to: `/workflows/${data.id}` })
        },
        onError: (error) => {
          handleError(error)
          console.error('Failed to create workflow')
        },
      },
    )
  }
  return (
    <>
      {modal}
      <EmptyView message="No workflows found." onNew={handleCreate} />
    </>
  )
}

export const WorkflowsList = ({ data }: { data?: Array<WorkflowSelect> }) => {
  return (
    <EntityList
      items={data ?? []}
      emptyView={<WorkflowsEmptyState />}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      getKey={(workflow) => workflow.id}
      className="flex-1"
    />
  )
}
export const WorkflowItem: React.FC<{ workflow: WorkflowSelect }> = ({ workflow }) => {
  const deleteWorkflow = useDeleteWorkflow()

  return (
    <EntityItem
      title={workflow.name}
      href={`/workflows/${workflow.id}`}
      subtitle={
        <>
          Updated {dayjs(workflow.updatedAt).fromNow()} &bull; Created{' '}
          {dayjs(workflow.createdAt).fromNow()}
        </>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <WorkflowIcon className="size-5" />
        </div>
      }
      onRemove={() => deleteWorkflow.mutate(workflow.id)}
      isRemoving={deleteWorkflow.isPending}
    />
  )
}
