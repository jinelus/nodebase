import { type NodeProps, Position } from '@xyflow/react'
import { memo } from 'react'
import { BaseHandle } from '../../components/react-flow/base-handle'
import { BaseNode, BaseNodeContent } from '../../components/react-flow/base-node'
import { WorkflowNode } from '../../components/workflow-node'

interface BaseTriggerNodeProps extends NodeProps {
  icon: React.ComponentType<{ className?: string }> | string
  name: string
  description?: string
  children?: React.ReactNode
  //  status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseTriggerNode: React.FC<BaseTriggerNodeProps> = memo(
  ({ icon: Icon, name, description, children, onSettings, onDoubleClick }) => {
    // TODO: Add delete functionality

    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={() => {}}
      >
        {/* TODO: Wrap within a NodeSStatusIndicator */}
        <BaseNode onDoubleClick={onDoubleClick} className="group relative rounded-l-2xl">
          <BaseNodeContent>
            {typeof Icon === 'string' ? (
              <img src={Icon} alt={`${name} icon`} className="size-4 object-contain" />
            ) : (
              <Icon className="size-4" />
            )}
            {children}
            <BaseHandle type="source" id={'source-1'} position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    )
  },
)

BaseTriggerNode.displayName = 'BaseTriggerNode'
