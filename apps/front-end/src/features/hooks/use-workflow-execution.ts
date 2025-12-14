'use client'

import { useRealtimeRun } from '@trigger.dev/react-hooks'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import type { NodeStatus } from '@/components/react-flow/node-status-indicator'
import { workflowExecutionAtom } from '@/lib/store/atom'

export function useWorkflowExecution() {
  const { runId, publicAuthToken } = useAtomValue(workflowExecutionAtom) ?? {}

  const { run, error } = useRealtimeRun(runId || '', {
    enabled: !!runId && !!publicAuthToken,
    accessToken: publicAuthToken || '',
  })

  const nodeStatuses = useMemo(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <nodes from metadata can be anything>
    const nodes = run?.metadata?.nodes as Record<string, any> | undefined
    if (!nodes) return new Map<string, NodeStatus>()

    return new Map(
      Object.entries(nodes).map(([nodeId, execution]) => [nodeId, execution.status as NodeStatus]),
    )
  }, [run?.metadata?.nodes])

  return {
    run,
    error,
    isExecuting: run?.status === 'EXECUTING',
    isCompleted: run?.status === 'COMPLETED',
    isFailed: run?.status === 'FAILED',
    getNodeStatus: (nodeId: string): NodeStatus => {
      return nodeStatuses.get(nodeId) || 'INITIAL'
    },
    getNodeExecution: (nodeId: string) => {
      // biome-ignore lint/suspicious/noExplicitAny: <nodes from metadata can be anything>
      const nodes = run?.metadata?.nodes as Record<string, any> | undefined
      return nodes?.[nodeId]
    },
  }
}
