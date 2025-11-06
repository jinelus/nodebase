import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/login/form'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </main>
  )
}
