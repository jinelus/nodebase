import type { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      id={props.id}
      name="Manual Trigger"
      icon={MousePointerIcon}
      //   onSettings={() => {}} TODO: implement settings
      //   onDoubleClick={() => {}} TODO: implement settings and double click
      // status={nodeStatus} TODO: implement status
    />
  )
})

ManualTriggerNode.displayName = 'ManualTriggerNode'
