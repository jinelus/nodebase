import { useSetAtom } from 'jotai'
import { FlaskConicalIcon } from 'lucide-react'
import { useExecuteWorkflow } from '@/data/hooks/use-workflows'
import { workflowExecutionAtom } from '@/lib/store/atom'
import { Button } from '../ui/button'

export const ExecuteWorkflowBtn = ({ workflowId }: { workflowId: string }) => {
  const executeWorkflow = useExecuteWorkflow()

  const editExecutionAtom = useSetAtom(workflowExecutionAtom)

  const handleExecute = () => {
    executeWorkflow.mutate(workflowId, {
      onSuccess: (data) => {
        editExecutionAtom({
          runId: data.runId,
          publicAuthToken: data.accessToken,
        })
      },
    })
  }

  return (
    <Button size={'lg'} onClick={handleExecute} disabled={executeWorkflow.isPending}>
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  )
}
