import { Link } from '@tanstack/react-router'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
} from '@xyflow/react'
import { Moon, SaveIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useUpdateWorkflow, useWorkflow } from '@/data/hooks/use-workflows'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { SidebarTrigger } from '../ui/sidebar'

import '@xyflow/react/dist/style.css'
import { AddNodeButton } from '../add-node-button'
import { nodeComponents } from '../node-component'

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  const { theme = 'system', setTheme } = useTheme()

  return (
    <header className="flex w-full items-center justify-between gap-6 px-6 py-4">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/workflows" preload="intent">
                  Workflows
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <EditorInputName workflowId={workflowId} />
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-4">
          <Button size={'sm'}>
            Save
            <SaveIcon className="ml-2" />
          </Button>
          <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </header>
  )
}

export const EditorInputName = ({ workflowId }: { workflowId: string }) => {
  const getWorkflow = useWorkflow(workflowId)
  const updateWorkflow = useUpdateWorkflow()

  const [name, setName] = useState(getWorkflow.data?.name || '')
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (getWorkflow.data) {
      setName(getWorkflow.data.name)
    }
  }, [getWorkflow.data])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (name === getWorkflow.data?.name) {
      setIsEditing(false)
      return
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name,
      })
    } catch {
      setName(getWorkflow.data?.name || '')
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setName(getWorkflow.data?.name || '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={updateWorkflow.isPending}
        className="h-7 max-w-[100px] border-0 p-0 font-semibold text-lg focus:ring-0"
      />
    )
  }

  return (
    <BreadcrumbItem
      className="cursor-pointer transition-colors hover:text-foreground"
      onClick={() => setIsEditing(true)}
    >
      {getWorkflow.data?.name || 'Loading...'}
    </BreadcrumbItem>
  )
}

/* Editor Canvas */

export const EditorContainer = ({ workflowId }: { workflowId: string }) => {
  const workflow = useWorkflow(workflowId)

  const [nodes, setNodes] = useState<Node[]>((workflow.data?.nodes as Node[]) || [])
  const [edges, setEdges] = useState<Edge[]>(workflow.data?.connections || [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  )
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  )

  return (
    <div className="w-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  )
}
