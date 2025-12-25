import { useParams } from '@tanstack/react-router'
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react'
import { useTheme } from 'next-themes'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseExecutionNode } from '../base-execution-node'
import { type AvailableModels, GrokDialog, type GrokFormValues } from './dialog'

type GrokNodeData = {
  variableName?: string
  model?: AvailableModels
  userPrompt?: string
  systemPrompt?: string
}

type GrokNodeType = Node<GrokNodeData>

export const GrokNode = memo((props: NodeProps<GrokNodeType>) => {
  const [open, setOpen] = useState(false)
  const { theme } = useTheme()

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const { setNodes } = useReactFlow()

  const nodeData = props.data as GrokNodeData
  const description = nodeData.userPrompt
    ? `${nodeData.model}: ${nodeData.userPrompt.slice(0, 30)}${nodeData.userPrompt.length > 30 ? '...' : ''}`
    : 'Not configured'

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)

  const handleSettings = () => setOpen(true)

  const handleSubmit = (values: GrokFormValues) => {
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
      <GrokDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Grok"
        description={description}
        icon={theme === 'dark' ? '/logos/grok-dark.svg' : '/logos/grok-light.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

GrokNode.displayName = 'GrokNode'
