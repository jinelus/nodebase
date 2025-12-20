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
import { generateGoogleFormScript } from './utils'

interface GoogleFormTriggerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const GoogleFormTriggerDialog: React.FC<GoogleFormTriggerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const params = useParams({ from: '/_protected/_editor/workflows/$workflowId' })
  const { workflowId } = params

  const baseUrl = env.VITE_BETTER_AUTH_URL || 'http://localhost:3000'
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      toast.success('Webhook URL copied to clipboard')
    } catch {
      toast.error('Failed to copy webhook URL to clipboard')
    }
  }

  const handleGoogleAppsScriptCopy = async () => {
    const script = generateGoogleFormScript(webhookUrl)
    try {
      await navigator.clipboard.writeText(script)
      toast.success('Google Apps Script copied to clipboard')
    } catch {
      toast.error('Failed to copy Google Apps Script to clipboard')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook Url in your Google Form's Apps Script to trigger the workflow when a
            form is submitted.
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
              <li>Open your Google Form.</li>
              <li>Click on the three dots menu &#8594; Script editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with the webhook URL above</li>
              <li>Save and click "Triggers" &#8594; Add Trigger</li>
              <li>Choose: From form &#8594; On form submit &#8594; Save</li>
            </ol>
          </div>

          <div className="space-y-3 rounded-lg bg-muted p-4">
            <h4 className="font-medium text-sm">Google Apps Script: </h4>
            <Button type="button" variant={'outline'} onClick={handleGoogleAppsScriptCopy}>
              <CopyIcon className="mr-2 size-4" />
              Copy Google Apps Script
            </Button>
            <p className="text-muted-foreground text-xs">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {'{{googleForm.respondentEmail}}'}
                </code>
                - Respondent's email
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {"{{googleForm.responses.['Question Name']}}"}
                </code>
                - Specific answer
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {'{{json googleForm.responses}}'}
                </code>
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
