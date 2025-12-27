import { createFileRoute } from '@tanstack/react-router'
import { CredentialForm } from '@/components/sections/credential-form'

export const Route = createFileRoute('/_protected/_rest/credentials/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full flex-col gap-y-8">
        <CredentialForm />
      </div>
    </div>
  )
}
