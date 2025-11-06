import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Form, FormField, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'

const signupSchema = z
  .object({
    email: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupSchema = z.infer<typeof signupSchema>

export function SignupForm() {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    },
    mode: 'onChange',
  })

  const router = useRouter()

  const onSubmit = async (data: SignupSchema) => {
    await authClient.signUp.email({
      email: data.email,
      name: data.username,
      password: data.password,
      callbackURL: `/`,
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signup successful!')
          router.navigate({ to: `/` })
        },
        onError: (error) => {
          toast.error(`Signup failed: ${error}`)
        },
      },
    })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl"> Welcome </CardTitle>
        <p className="text-muted-foreground">Signup to create an account.</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div>
                  <Label>
                    Username <span className="text-red-600 text-sm">*</span>{' '}
                  </Label>
                  <Input className="w-full rounded-md px-3 py-2" {...field} />
                  <FormMessage className="text-red-600 text-sm" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div>
                  <Label>
                    Email <span className="text-red-600 text-sm">*</span>{' '}
                  </Label>
                  <Input className="w-full rounded-md px-3 py-2" {...field} />
                  <FormMessage className="text-red-600 text-sm" />
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
                  <Input type="password" className="w-full rounded-md px-3 py-2" {...field} />
                  <FormMessage className="text-red-600 text-sm" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <div className="mt-4">
                  <Label>
                    Confirm Password <span className="text-red-600 text-sm">*</span>{' '}
                  </Label>
                  <Input type="password" className="w-full rounded-md px-3 py-2" {...field} />
                  <FormMessage className="text-red-600 text-sm" />
                </div>
              )}
            />
            <div className="flex flex-col items-center gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Signup'}
              </Button>
              <p className="text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline underline-offset-2">
                  Login
                </a>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
