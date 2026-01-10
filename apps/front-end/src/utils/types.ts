import type { InferSelectModel } from 'drizzle-orm'
import type { connections, executions, node, nodeTypes, workflows } from '@/db/schemas'
import type { credentials } from '@/db/schemas/credentials'

export type WorkflowSelect = InferSelectModel<typeof workflows>

export type Node = InferSelectModel<typeof node>

export type Connections = InferSelectModel<typeof connections>

export type CredentialsSelect = InferSelectModel<typeof credentials>

export type ExecutionsSelect = InferSelectModel<typeof executions>

export type NodeType = (typeof nodeTypes.enumValues)[number]

export type TaskContext = {
  run: <T>(name: string, fn: () => Promise<T>) => Promise<T>
}

export type WorkflowContext = Record<string, unknown>

export type NodeExecutorParams<TData = Record<string, unknown>> = {
  data: TData
  nodeId: string
  context: WorkflowContext
  taskContext: TaskContext
  userId: string
}

export type NodeExecutor<TData = Record<string, unknown>, TResult = WorkflowContext> = (
  params: NodeExecutorParams<TData>,
) => Promise<TResult>
