import { useParams } from '@tanstack/react-router'
import type { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseTriggerNode } from '../base-trigger-node'
import { StripeTriggerDialog } from './dialog'

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const handleSettings = () => setOpen(true)

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)

  return (
    <>
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        name="Stripe Trigger"
        description="When a Stripe event is captured"
        icon={'/logos/stripe.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

StripeTriggerNode.displayName = 'StripeTriggerNode'
