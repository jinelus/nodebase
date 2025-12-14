import type { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseTriggerNode } from '../base-trigger-node'
import { ManualTriggerDialog } from './dialog'

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const handleSettings = () => setOpen(true)

  const status = useWorkflowExecution().getNodeStatus(props.id)

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        name="Manual Trigger"
        icon={MousePointerIcon}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

ManualTriggerNode.displayName = 'ManualTriggerNode'
