import { FlaskConicalIcon } from 'lucide-react'
import { useExecuteWorkflow } from '@/data/hooks/use-workflows'
import { Button } from '../ui/button'

export const ExecuteWorkflowBtn = ({ workflowId }: { workflowId: string }) => {
  const executeWorkflow = useExecuteWorkflow()

  const handleExecute = () => {
    executeWorkflow.mutate(workflowId)
  }

  return (
    <Button size={'lg'} onClick={handleExecute} disabled={executeWorkflow.isPending}>
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  )
}
