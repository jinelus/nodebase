import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Form, FormField, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type LoginSchema = z.infer<typeof loginSchema>

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const router = useRouter()
  const search = useSearch({ from: '/_auth/login' })
  const redirectTo = (search as { redirect: string | null }).redirect

  const onSubmit = async (data: LoginSchema) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success('Login successful!')
          router.navigate({ to: redirectTo ?? '/' })
        },
        onError: (error) => {
          toast.error(`Login failed: ${error}`)
        },
      },
    })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl"> Welcome Back </CardTitle>
        <p className="text-muted-foreground">Login to your account to continue.</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div>
                  <Label>
                    Email <span className="text-red-600 text-sm">*</span>{' '}
                  </Label>
                  <Input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    {...field}
                  />
                  <FormMessage className="mt-1 text-red-600 text-sm" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="mt-4">
                  <Label>
                    Password <span className="text-red-600 text-sm">*</span>{' '}
                  </Label>
                  <Input
                    type="password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    {...field}
                  />
                  <FormMessage className="mt-1 text-red-600 text-sm" />
                </div>
              )}
            />
            <div className="flex flex-col items-center gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Login'}
              </Button>
              <p className="text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="underline underline-offset-2">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
