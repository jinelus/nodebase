import { createFileRoute } from '@tanstack/react-router'
import { executeWorkflow } from '@/lib/trigger/functions'

export const Route = createFileRoute('/api/webhooks/stripe/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url)
        const workflowId = url.searchParams.get('workflowId')

        if (!workflowId) {
          return new Response(JSON.stringify({ success: false, message: 'Missing workflowId' }), {
            status: 400,
          })
        }

        const body = await request.json()

        const formData = {
          // Event metadata
          eventId: body.id,
          eventType: body.type,
          timestamp: body.created,
          livemode: body.livemode,
          raw: body.data?.object,
        }

        await executeWorkflow.trigger({
          workflowId,
          initialData: {
            stripe: formData,
          },
        })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Stripe webhook received',
          }),
          { status: 200 },
        )
      },
    },
  },
})
