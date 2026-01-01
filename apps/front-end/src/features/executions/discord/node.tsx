import { useParams } from '@tanstack/react-router'
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useWorkflowExecution } from '@/features/hooks/use-workflow-execution'
import { BaseExecutionNode } from '../base-execution-node'
import { DiscordDialog, type DiscordFormValues } from './dialog'

type DiscordNodeData = {
  variableName: string
  webhookUrl: string
  content?: string
  username?: string
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [open, setOpen] = useState(false)

  const { workflowId } = useParams({ from: '/_protected/_editor/workflows/$workflowId' })

  const { setNodes } = useReactFlow()

  const nodeData = props.data as DiscordNodeData
  const description = nodeData.content
    ? `${nodeData.content.slice(0, 30)}${nodeData.content.length > 30 ? '...' : ''}`
    : 'Not configured'

  const status = useWorkflowExecution({ workflowId }).getNodeStatus(props.id)

  const handleSettings = () => setOpen(true)

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Discord"
        description={description}
        icon={'/logos/discord.svg'}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        status={status}
      />
    </>
  )
})

DiscordNode.displayName = 'DiscordNode'
