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
  'grok-2',
  'grok-2-latest',
  'grok-3',
  'grok-3-latest',
  'grok-3-mini',
  'grok-3-mini-fast',
  'grok-4',
  'grok-code-fast-1',
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

export type GrokFormValues = z.infer<typeof formSchema>

interface GrokDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: GrokFormValues) => void
  defaultValues?: Partial<GrokFormValues>
}

export const GrokDialog: React.FC<GrokDialogProps> = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm<GrokFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? 'response',
      model: defaultValues?.model ?? 'grok-4',
      userPrompt: defaultValues?.userPrompt ?? '',
      systemPrompt: defaultValues?.systemPrompt ?? '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? 'response',
        model: defaultValues?.model ?? 'grok-4',
        userPrompt: defaultValues?.userPrompt ?? '',
        systemPrompt: defaultValues?.systemPrompt ?? '',
      })
    }
  }, [open, defaultValues, form])

  const watchVariableName = form.watch('variableName')

  const handleSubmit = (values: GrokFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grok Configuration</DialogTitle>
          <DialogDescription>Configure settings for the Grok model here.</DialogDescription>
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
                      subsequent nodes: {`{{${watchVariableName}.grokResponse}}`}
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
                    <FormDescription className="text-xs">The Grok model to use.</FormDescription>
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
