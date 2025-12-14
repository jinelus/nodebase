import { type NodeProps, Position, useReactFlow } from '@xyflow/react'
import { memo } from 'react'
import { type NodeStatus, NodeStatusIndicator } from '@/components/react-flow/node-status-indicator'
import { BaseHandle } from '../../components/react-flow/base-handle'
import { BaseNode, BaseNodeContent } from '../../components/react-flow/base-node'
import { WorkflowNode } from '../../components/workflow-node'

interface BaseTriggerNodeProps extends NodeProps {
  icon: React.ComponentType<{ className?: string }> | string
  name: string
  description?: string
  children?: React.ReactNode
  status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseTriggerNode: React.FC<BaseTriggerNodeProps> = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    id,
    status = 'INITIAL',
  }) => {
    const { setNodes, setEdges } = useReactFlow()

    const handleDelete = () => {
      setNodes((nds) => nds.filter((n) => n.id !== id))

      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
    }

    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator status={status} variant="border" className="rounded-l-2xl">
          <BaseNode
            status={status}
            onDoubleClick={onDoubleClick}
            className="group relative rounded-l-2xl"
          >
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
        </NodeStatusIndicator>
      </WorkflowNode>
    )
  },
)

BaseTriggerNode.displayName = 'BaseTriggerNode'
