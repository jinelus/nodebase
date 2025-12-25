import { useParams } from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { env } from '@/utils/env'

interface StripeTriggerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const StripeTriggerDialog: React.FC<StripeTriggerDialogProps> = ({ open, onOpenChange }) => {
  const params = useParams({ from: '/_protected/_editor/workflows/$workflowId' })
  const { workflowId } = params

  const baseUrl = env.VITE_BETTER_AUTH_URL || 'http://localhost:3000'
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      toast.success('Webhook URL copied to clipboard')
    } catch {
      toast.error('Failed to copy webhook URL to clipboard')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook Url in your Stripe configuration to trigger the workflow when a stripe
            event is captured.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input id="webhookUrl" value={webhookUrl} readOnly className="flex-1" />
              <Button type="button" variant={'outline'} size={'icon'} onClick={copyToClipboard}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="list-inside list-decimal space-y-1 text-muted-foreground text-sm">
              <li> Open your Stripe Dashboard. </li>
              <li>Go to Developers &#8594; Webhooks</li>
              <li>Click on "Add endpoint"</li>
              <li>Paste the webhook URL provided above.</li>
              <li>Select the events you want to listen to (e.g., "payment_intent.succeeded").</li>
              <li> Save and copy the signing secret </li>
            </ol>
          </div>

          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>
                <code className="rounded bg-background px-1 py-0.5">{'{{stripe.eventId}}'}</code> -
                Unique event identifier
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">{'{{stripe.eventType}}'}</code>{' '}
                - Event type (e.g., payment_intent.succeeded)
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">{'{{stripe.raw}}'}</code> - +
                Full event data object
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">{'{{stripe.timestamp}}'}</code>{' '}
                - Event timestamp
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">{'{{stripe.livemode}}'}</code> -
                Whether this is a live event
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
