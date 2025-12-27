import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaginationParams } from '@/utils/pagination'
import {
  type CredentialsTypes,
  createCredentialFn,
  deleteCredentialFn,
  getCredentialByIdFn,
  getCredentialByTypeFn,
  getUserCredentialsFn,
  updateCredentialFn,
} from '../credentials'

const CREDENTIAL_KEY = ['credentials']

export const useCreateCredential = () => {
  const query = useQueryClient()

  return useMutation({
    mutationFn: async (input: { name: string; value: string; type: CredentialsTypes }) =>
      await createCredentialFn({ data: input }),
    onSuccess: () => {
      toast.success('Credential created successfully')
      query.invalidateQueries({ queryKey: CREDENTIAL_KEY })
    },
  })
}

export const useUpdateCredential = () => {
  const query = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      id: string
      name?: string
      value?: string
      type?: CredentialsTypes
    }) => await updateCredentialFn({ data: input }),
    onSuccess: (data) => {
      toast.success('Credential updated successfully')
      query.invalidateQueries({ queryKey: [...CREDENTIAL_KEY, data.id] })
    },
    onError: (error) => {
      toast.error(
        `Error updating credential: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    },
  })
}

export const useDeleteCredential = () => {
  const query = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => await deleteCredentialFn({ data: id }),
    onSuccess: () => {
      toast.success('Credential deleted successfully')
      query.invalidateQueries({ queryKey: CREDENTIAL_KEY })
    },
    onError: (error) => {
      toast.error(
        `Error deleting credential: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    },
  })
}

export const useGetCredentialById = (id: string) => {
  return useQuery({
    queryKey: [...CREDENTIAL_KEY, id],
    queryFn: async () => await getCredentialByIdFn({ data: id }),
    enabled: !!id,
  })
}

export const useGetCredentials = (params: PaginationParams) => {
  return queryOptions({
    queryKey: [...CREDENTIAL_KEY, params],
    queryFn: async () => await getUserCredentialsFn({ data: params }),
    placeholderData: keepPreviousData,
  })
}

export const useGetCredentialsByType = (type: CredentialsTypes) => {
  return useQuery({
    queryKey: [...CREDENTIAL_KEY, `type-${type}`],
    queryFn: async () => await getCredentialByTypeFn({ data: type }),
  })
}
