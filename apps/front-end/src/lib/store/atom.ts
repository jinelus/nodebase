import type { ReactFlowInstance } from '@xyflow/react'
import { atom } from 'jotai'

export const editorAtom = atom<ReactFlowInstance | null>(null)

export const workflowExecutionAtom = atom<{
  runId: string | null
  publicAuthToken: string | null
} | null>(null)
