import type { NodeTypes } from '@xyflow/react'
import { InitialNode } from './react-flow/initial-node'

const NODETYPE = {
  INITIAL: 'INITIAL',
} as const

export const nodeComponents = {
  [NODETYPE.INITIAL]: InitialNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents
