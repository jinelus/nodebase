import { useRouter } from '@tanstack/react-router'
import { useCreateWorkflow } from '@/data/hooks/use-workflows'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { EntityContainer, EntityHeader } from '../entity-components'

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
    <EntityContainer header={<WorkflowHeader />} pagination={null} search={null}>
      {children}
    </EntityContainer>
  )
}
