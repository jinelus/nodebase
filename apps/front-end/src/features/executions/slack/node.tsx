import { useParams } from '@tanstack/react-router'
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseExecutionNode } from '../base-execution-node'
import { SlackDialog, type SlackFormValues } from './dialog'

type SlackNodeData = {
  variableName: string
  webhookUrl: string
  content?: string
}

type SlackNodeType = Node<SlackNodeData>

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const [open, setOpen] = useState(false)

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const { setNodes } = useReactFlow()

  const nodeData = props.data as SlackNodeData
  const description = nodeData.content
    ? `${nodeData.content.slice(0, 30)}${nodeData.content.length > 30 ? '...' : ''}`
    : 'Not configured'

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)

  const handleSettings = () => setOpen(true)

  const handleSubmit = (values: SlackFormValues) => {
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
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Slack"
        description={description}
        icon={'/logos/slack.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

SlackNode.displayName = 'SlackNode'
