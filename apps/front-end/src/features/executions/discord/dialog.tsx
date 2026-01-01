import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  variableName: z.string().min(1, 'Variable name is required'),
  webhookUrl: z.string().min(1, 'Webhook URL is required'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be at most 2000 characters'),
  username: z.string().optional(),
})

export type DiscordFormValues = z.infer<typeof formSchema>

interface DiscordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: DiscordFormValues) => void
  defaultValues?: Partial<DiscordFormValues>
}

export const DiscordDialog: React.FC<DiscordDialogProps> = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: defaultValues?.webhookUrl ?? '',
      content: defaultValues?.content ?? '',
      username: defaultValues?.username ?? '',
      variableName: defaultValues?.variableName ?? 'response',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? 'response',
        webhookUrl: defaultValues?.webhookUrl ?? '',
        content: defaultValues?.content ?? '',
        username: defaultValues?.username ?? '',
      })
    }
  }, [open, defaultValues, form])

  const watchVariableName = form.watch('variableName')

  const handleSubmit = (values: DiscordFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Discord</DialogTitle>
          <DialogDescription>Configure settings for the Discord webhook here.</DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">Variable Name</FormLabel>
                    <Input {...field} placeholder="response" />
                    <FormDescription className="text-xs">
                      The name of the variable to store the HTTP response, and will be accessible in
                      subsequent nodes: {`{{${watchVariableName}.discordResponse.data}}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">Webhook URL</FormLabel>
                    <Input
                      {...field}
                      placeholder="https://discord.com/api/webhooks/your-webhook-id/your-webhook-token"
                    />
                    <FormDescription className="text-xs">
                      Get this from your Discord channel settings &#8594; Integrations &#8594;
                      Webhooks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">Content</FormLabel>
                    <Textarea
                      {...field}
                      placeholder="Enter the message content to send to Discord"
                      className="h-32 resize-none"
                    />
                    <FormDescription className="text-xs">
                      The content of the message to be sent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">Bot name (optional)</FormLabel>
                    <Input {...field} placeholder="Enter a bot name to display" />
                    <FormDescription className="text-xs">
                      The bot name to display for the message.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
