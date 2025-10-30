import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInComponent,
})

function SignInComponent() {
  return <div>Sign In</div>
}
