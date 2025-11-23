import type { NodeTypes } from '@xyflow/react'
import { HttpRequestNode } from '@/features/executions/http-request/node'
import { ManualTriggerNode } from '@/features/triggers/manual-trigger/node'
import { InitialNode } from './react-flow/initial-node'

export const NODETYPE = {
  INITIAL: 'INITIAL',
  MANUAL_TRIGGER: 'MANUAL_TRIGGER',
  HTTP_REQUEST: 'HTTP_REQUEST',
} as const

export type NodeType = (typeof NODETYPE)[keyof typeof NODETYPE]

export const nodeComponents = {
  [NODETYPE.INITIAL]: InitialNode,
  [NODETYPE.MANUAL_TRIGGER]: ManualTriggerNode,
  [NODETYPE.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents
