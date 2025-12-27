import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { type CredentialsTypes, CredentialsTypesValues } from '@/data/credentials'
import { useCreateCredential, useUpdateCredential } from '@/data/hooks/use-credentials'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(CredentialsTypesValues),
  value: z.string().min(1, 'Value is required'),
})

const credentialTypesOptions = [
  {
    value: 'GEMINI',
    label: 'Gemini',
    logo: '/logos/gemini.svg',
  },
  {
    value: 'OPENAI',
    label: 'OpenAI',
    logo: '/logos/chatgpt.svg',
  },
  {
    value: 'ANTHROPIC',
    label: 'Anthropic',
    logo: '/logos/claude.svg',
  },
  {
    value: 'GROK',
    label: 'Grok',
    logo: '/logos/grok-light.svg',
  },
  {
    value: 'DEEPSEEK',
    label: 'Deepseek',
    logo: '/logos/deepseek.svg',
  },
]

type FormData = z.infer<typeof formSchema>

interface CredentialFormProps {
  initialData?: {
    id?: string
    name?: string
    type?: CredentialsTypes
    value?: string
  }
}

export const CredentialForm: React.FC<CredentialFormProps> = ({ initialData }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || CredentialsTypesValues[0],
      value: initialData?.value || '',
    },
  })

  const isEditing = !!initialData?.id

  const { handleError, modal } = useUpgradeModal()

  const createCredential = useCreateCredential()
  const updateCredential = useUpdateCredential()

  const router = useRouter()

  const handleSubmit = async (data: FormData) => {
    if (isEditing && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...data,
      })
    } else {
      await createCredential.mutateAsync(data, {
        onSuccess: () => {
          router.navigate({ to: `/credentials` })
        },
        onError: (error) => {
          handleError(error)
        },
      })
    }
  }

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Credential' : 'New Credential'}</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update your credential information below.'
              : 'Fill out the form below to create a new credential.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My API Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full shadow-none">
                          <SelectValue placeholder="Select Credential Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentialTypesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <img src={option.logo} alt={option.label} className="h-5 w-5" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="sk-xxxxxxxxxxxxxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createCredential.isPending || updateCredential.isPending}
                >
                  {isEditing ? 'Update Credential' : 'Create Credential'}
                </Button>
                <Button variant="outline" type="button" asChild>
                  <Link to="/credentials">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
