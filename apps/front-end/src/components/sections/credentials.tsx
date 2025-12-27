import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  useDeleteCredential,
  useGetCredentialById,
  useGetCredentials,
} from '@/data/hooks/use-credentials'
import { useCredentialsParams } from '@/data/hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'
import type { CredentialsSelect } from '@/utils/types'
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  LoadingView,
} from '../entity-components'
import { CredentialForm } from './credential-form'

dayjs.extend(relativeTime)

export const CredentialHeader: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  return (
    <EntityHeader
      title="Credentials"
      newButtonLabel="New Credential"
      description="Create and manage your credentials"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  )
}

export const CredentialContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      pagination={<CredentialsPagination />}
      search={<CredentialsSearch />}
    >
      {children}
    </EntityContainer>
  )
}

export const CredentialsSearch = () => {
  const [{ page, search }, setParams] = useCredentialsParams()

  const { searchValue, setSearchValue } = useEntitySearch({
    params: { page, search },
    setParams,
    debounceTime: 500,
  })

  return (
    <EntitySearch value={searchValue} onChange={setSearchValue} placeholder="Search Credentials" />
  )
}

export const CredentialsPagination = () => {
  const [params, setParams] = useCredentialsParams()
  const credentials = useSuspenseQuery(useGetCredentials(params))

  const handlePageChange = (newPage: number) => {
    setParams((prev) => {
      return { ...prev, page: newPage }
    })
  }

  return (
    <EntityPagination
      page={credentials.data.currentPage}
      totalPages={credentials.data.totalPages}
      onPageChange={handlePageChange}
      disabled={credentials.isPending}
    />
  )
}

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />
}

export const CredentialsEmptyState = () => {
  const router = useRouter()

  return (
    <EmptyView
      message="No credentials found."
      onNew={() => router.navigate({ to: '/credentials/new' })}
    />
  )
}

export const CredentialsList = ({ data }: { data?: Array<CredentialsSelect> }) => {
  return (
    <EntityList
      items={data ?? []}
      emptyView={<CredentialsEmptyState />}
      renderItem={(credential) => <CredentialItem credential={credential} />}
      getKey={(credential) => credential.id}
      className="flex-1"
    />
  )
}

const credentialsLogoMap: Record<CredentialsSelect['type'], string> = {
  OPENAI: '/logos/chatgpt.svg',
  ANTHROPIC: '/logos/claude.svg',
  GEMINI: '/logos/gemini.svg',
  DEEPSEEK: '/logos/deepseek.svg',
  GROK: '/logos/grok-light.svg',
}

export const CredentialItem: React.FC<{ credential: CredentialsSelect }> = ({ credential }) => {
  const deleteCredential = useDeleteCredential()

  const logo = credentialsLogoMap[credential.type]

  return (
    <EntityItem
      title={credential.name}
      href={`/credentials/${credential.id}`}
      subtitle={
        <>
          Updated {dayjs(credential.updatedAt).fromNow()} &bull; Created{' '}
          {dayjs(credential.createdAt).fromNow()}
        </>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <img src={logo} alt={credential.type} className="size-5" />
        </div>
      }
      onRemove={() => deleteCredential.mutate(credential.id)}
      isRemoving={deleteCredential.isPending}
    />
  )
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data, isPending } = useGetCredentialById(credentialId)

  return isPending ? (
    <LoadingView message="Loading credential..." />
  ) : (
    <CredentialForm initialData={data?.credential} />
  )
}
