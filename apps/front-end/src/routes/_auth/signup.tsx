import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/signup/form'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignupForm />
    </main>
  )
}
