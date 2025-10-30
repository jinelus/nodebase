import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <div className={`p-2`}>
      <div className={`text-lg`}>Welcome to the Dashboard!</div>
    </div>
  )
}
