import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'
import type { NodeExecution, NodeStatus } from '@/lib/trigger/functions'
import { env } from '@/utils/env'

export function useWorkflowExecution({ workflowId }: { workflowId: string }) {
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map())

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
      setNodeStatuses(
        new Map(
          Object.entries(data).map(([nodeId, execution]) => [
            nodeId,
            execution.status as NodeStatus,
          ]),
        ),
      )
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusherClient.disconnect()
    }
  }, [workflowId])

  return {
    getNodeStatus: (nodeId: string) => nodeStatuses.get(nodeId) ?? 'INITIAL',
  }
}
