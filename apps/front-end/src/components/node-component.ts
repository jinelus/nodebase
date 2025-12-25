import type { NodeTypes } from '@xyflow/react'
import { AnthropicNode } from '@/features/executions/anthropic/node'
import { DeepseekNode } from '@/features/executions/deepseek/node'
import { GeminiNode } from '@/features/executions/gemini/node'
import { HttpRequestNode } from '@/features/executions/http-request/node'
import { OpenAiNode } from '@/features/executions/openai/node'
import { GrokNode } from '@/features/executions/xia/node'
import { GoogleFormTriggerNode } from '@/features/triggers/google-form/node'
import { ManualTriggerNode } from '@/features/triggers/manual-trigger/node'
import { StripeTriggerNode } from '@/features/triggers/stripe/node'
import { InitialNode } from './react-flow/initial-node'

export const NODETYPE = {
  INITIAL: 'INITIAL',
  MANUAL_TRIGGER: 'MANUAL_TRIGGER',
  GOOGLE_FORM_TRIGGER: 'GOOGLE_FORM_TRIGGER',
  STRIPE_TRIGGER: 'STRIPE_TRIGGER',
  HTTP_REQUEST: 'HTTP_REQUEST',
  GEMINI: 'GEMINI',
  OPENAI: 'OPENAI',
  ANTHROPIC: 'ANTHROPIC',
  GROK: 'GROK',
  DEEPSEEK: 'DEEPSEEK',
} as const

export type NodeType = (typeof NODETYPE)[keyof typeof NODETYPE]

export const nodeComponents = {
  [NODETYPE.INITIAL]: InitialNode,

  // Trigger Nodes
  [NODETYPE.MANUAL_TRIGGER]: ManualTriggerNode,
  [NODETYPE.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NODETYPE.STRIPE_TRIGGER]: StripeTriggerNode,

  // Execution Nodes
  [NODETYPE.HTTP_REQUEST]: HttpRequestNode,
  [NODETYPE.GEMINI]: GeminiNode,
  [NODETYPE.OPENAI]: OpenAiNode,
  [NODETYPE.ANTHROPIC]: AnthropicNode,
  [NODETYPE.GROK]: GrokNode,
  [NODETYPE.DEEPSEEK]: DeepseekNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents
