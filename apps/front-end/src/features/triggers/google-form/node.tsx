import { useParams } from '@tanstack/react-router'
import type { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseTriggerNode } from '../base-trigger-node'
import { GoogleFormTriggerDialog } from './dialog'

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const handleSettings = () => setOpen(true)

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)
  
  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        name="Google Form"
        description="When form is submitted"
        icon={'/google-forms.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

GoogleFormTriggerNode.displayName = 'GoogleFormTriggerNode'
