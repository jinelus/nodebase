import { useParams } from '@tanstack/react-router'
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseExecutionNode } from '../base-execution-node'
import { type AvailableModels, DeepseekDialog, type DeepseekFormValues } from './dialog'

type DeepseekNodeData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
}

type DeepseekNodeType = Node<DeepseekNodeData>

export const DeepseekNode = memo((props: NodeProps<DeepseekNodeType>) => {
  const [open, setOpen] = useState(false)

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const { setNodes } = useReactFlow()

  const nodeData = props.data as DeepseekNodeData
  const description = nodeData.userPrompt
    ? `${nodeData.model}: ${nodeData.userPrompt.slice(0, 30)}${nodeData.userPrompt.length > 30 ? '...' : ''}`
    : 'Not configured'

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)

  const handleSettings = () => setOpen(true)

  const handleSubmit = (values: DeepseekFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          }
        }
        return node
      }),
    )
    setOpen(false)
  }

  return (
    <>
      <DeepseekDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Deepseek"
        description={description}
        icon={'/logos/deepseek.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

DeepseekNode.displayName = 'DeepseekNode'
