import type { logger, tasks, wait } from '@trigger.dev/sdk'
import type { InferSelectModel } from 'drizzle-orm'
import type { connections, node, nodeTypes, workflows } from '@/db/schemas'

export type WorkflowSelect = InferSelectModel<typeof workflows>

export type Node = InferSelectModel<typeof node>

export type Connections = InferSelectModel<typeof connections>

export type NodeType = (typeof nodeTypes.enumValues)[number]

export type TaskContext = {
  logger: typeof logger
  run: <T>(name: string, fn: () => Promise<T>) => Promise<T>
  wait?: typeof wait
  tasks?: typeof tasks
}

export type WorkflowContext = Record<string, unknown>

export type NodeExecutorParams<TData = Record<string, unknown>> = {
  data: TData
  nodeId: string
  context: WorkflowContext
  taskContext: TaskContext
}

export type NodeExecutor<TData = Record<string, unknown>, TResult = WorkflowContext> = (
  params: NodeExecutorParams<TData>,
) => Promise<TResult>
