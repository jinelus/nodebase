import type { NodeProps } from '@xyflow/react'
import { PlusIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { NodeSelector } from '../node-selector'
import { WorkflowNode } from '../workflow-node'
import { PlaceholderNode } from './placeholder-node'

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setOpen(true)}>
          <div className="flex cursor-pointer items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  )
})

InitialNode.displayName = 'InitialNode'
