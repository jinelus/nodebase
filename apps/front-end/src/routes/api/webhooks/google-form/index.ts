import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { executeWorkflow } from '@/lib/trigger/functions'

export const Route = createFileRoute('/api/webhooks/google-form/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userSession = await auth.api.getSession({
          headers: request.headers,
        })

        if (!userSession) {
          return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
            status: 401,
          })
        }

        const url = new URL(request.url)
        const workflowId = url.searchParams.get('workflowId')

        if (!workflowId) {
          return new Response(JSON.stringify({ success: false, message: 'Missing workflowId' }), {
            status: 400,
          })
        }

        const body = await request.json()

        const formData = {
          formId: body.formId,
          formTitle: body.formTitle,
          responseId: body.responseId,
          timestamp: body.timestamp,
          respondentEmail: body.respondentEmail,
          responses: body.responses,
          raw: body,
        }

        const result = await executeWorkflow.trigger({
          workflowId,
          initialData: {
            googleForm: formData,
          },
        })

        return new Response(
          JSON.stringify({
            success: true,
            data: { jobRunning: result },
            message: 'Google Form webhook received',
          }),
          { status: 200 },
        )
      },
    },
  },
})
