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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const AVAILABLE_MODELS = [
  'chatgpt-4o-latest',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-1106',
  'gpt-4',
  'gpt-4-0613',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-2024-11-20',
  'gpt-4o-mini',
  'gpt-4.1-nano',
  'gpt-5',
  'gpt-5-chat-latest',
  'gpt-5-codex',
  'gpt-5-nano',
  'gpt-5-pro',
  'gpt-5.1',
  'gpt-5.1-chat-latest',
  'gpt-5.1-codex',
  'gpt-5.1-codex-max',
  'gpt-5.2',
  'gpt-5.2-pro',
] as const

export type AvailableModels = (typeof AVAILABLE_MODELS)[number]

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, 'Variable name is required')
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      'Variable name must start with a letter or underscore and contain only letters, numbers, and underscores.',
    ),
  model: z.enum(AVAILABLE_MODELS, { message: 'Please select a valid model' }),
  userPrompt: z.string().min(1, 'User prompt is required'),
  systemPrompt: z.string().optional(),
})

export type OpenAiFormValues = z.infer<typeof formSchema>

interface OpenAiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: OpenAiFormValues) => void
  defaultValues?: Partial<OpenAiFormValues>
}

export const OpenAiDialog: React.FC<OpenAiDialogProps> = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm<OpenAiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? 'response',
      model: defaultValues?.model ?? 'chatgpt-4o-latest',
      userPrompt: defaultValues?.userPrompt ?? '',
      systemPrompt: defaultValues?.systemPrompt ?? '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? 'response',
        model: defaultValues?.model ?? 'chatgpt-4o-latest',
        userPrompt: defaultValues?.userPrompt ?? '',
        systemPrompt: defaultValues?.systemPrompt ?? '',
      })
    }
  }, [open, defaultValues, form])

  const watchVariableName = form.watch('variableName')

  const handleSubmit = (values: OpenAiFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OpenAi Configuration</DialogTitle>
          <DialogDescription>Configure settings for the OpenAi model here.</DialogDescription>
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
                      subsequent nodes: {`{{${watchVariableName}.openaiResponse.data}}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                defaultValue={AVAILABLE_MODELS[0]}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">Model</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[150px]">
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">The OpenAi model to use.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">User Prompt</FormLabel>
                    <Textarea
                      {...field}
                      className="min-h-[75px] font-mono text-sm"
                      placeholder="Write a poem about a lonely cloud."
                    />
                    <FormDescription className="text-xs">
                      The prompt to generate the response. Use {'{{variables}}'} to reference simple
                      values or {'{{json variable}}'} to stringify objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1 block font-medium">
                      System Prompt (Optional)
                    </FormLabel>
                    <Textarea
                      {...field}
                      className="min-h-[75px] font-mono text-sm"
                      placeholder="You are a helpful assistant that provides concise answers."
                    />
                    <FormDescription className="text-xs">
                      Set the behavior of the model. Use {'{{variables}}'} to reference simple
                      values or {'{{json variable}}'} to stringify objects.
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
