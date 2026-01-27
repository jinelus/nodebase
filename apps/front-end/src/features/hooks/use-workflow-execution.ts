import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { NodeExecution, NodeStatus } from '@/lib/trigger/functions'
import { env } from '@/utils/env'

export function useWorkflowExecution({ workflowId }: { workflowId: string }) {
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map())
  const [nodeErrors, setNodeErrors] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (!env.VITE_PUSHER_KEY || !env.VITE_PUSHER_CLUSTER) {
      console.warn('Pusher keys are not set in environment variables')
      return
    }

    const pusherClient = new Pusher(env.VITE_PUSHER_KEY, {
      cluster: env.VITE_PUSHER_CLUSTER,
    })

    const channel = pusherClient.subscribe(`workflow-${workflowId}`)

    channel.bind('nodes', (data: Record<string, NodeExecution>) => {
      const newStatuses = new Map<string, NodeStatus>()
      const newErrors = new Map<string, string>()

      for (const [nodeId, execution] of Object.entries(data)) {
        newStatuses.set(nodeId, execution.status)

        if (execution.error) {
          newErrors.set(nodeId, execution.error)
          toast.error(`Node execution failed: ${execution.error}`)
        }
      }

      setNodeStatuses(newStatuses)
      setNodeErrors(newErrors)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusherClient.disconnect()
    }
  }, [workflowId])

  return {
    getNodeStatus: (nodeId: string) => nodeStatuses.get(nodeId) ?? 'INITIAL',
    getNodeError: (nodeId: string) => nodeErrors.get(nodeId),
  }
}
