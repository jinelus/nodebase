import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'
import {
  CredentialContainer,
  CredentialsList,
  CredentialsLoading,
} from '@/components/sections/credentials'
import { useGetCredentials } from '@/data/hooks/use-credentials'
import { credentialsParams } from '@/utils/params'

export const Route = createFileRoute('/_protected/_rest/credentials/')({
  component: RouteComponent,
  validateSearch: createStandardSchemaV1(credentialsParams, {
    partialOutput: true,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(useGetCredentials(deps))
  },
  pendingComponent: () => <div>Loading credentials...</div>,
})

function RouteComponent() {
  const { page, perPage, search } = Route.useSearch()

  const { data, isPending } = useQuery(
    useGetCredentials({
      page,
      perPage,
      search,
    }),
  )

  return (
    <CredentialContainer>
      {isPending ? <CredentialsLoading /> : <CredentialsList data={data?.credentials ?? []} />}
    </CredentialContainer>
  )
}
