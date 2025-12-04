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
  createWorkflowFn,
  deleteWorkflowFn,
  getWorkflowByIdFn,
  getWorkflowsFn,
  type UpdateWorkflowNodesInput,
  updateWorkflowFn,
  updateWorkflowNodesFn,
} from '../workflows'

const WORKFLOWS_QUERY_KEY = ['workflows']

export const useGetWorkflows = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: [...WORKFLOWS_QUERY_KEY, params],
    queryFn: async () => await getWorkflowsFn({ data: params }),
    placeholderData: keepPreviousData,
  })
}

export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: [...WORKFLOWS_QUERY_KEY, id],
    queryFn: async () => await getWorkflowByIdFn({ data: id }),
    enabled: !!id,
  })
}

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { name: string }) => await createWorkflowFn({ data: input }),
    onSuccess: () => {
      toast.success('Workflow created successfully')

      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY })
    },
  })
}

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; name: string }) =>
      await updateWorkflowFn({ data: input }),
    onSuccess: (data) => {
      toast.success('Workflow updated successfully')
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...WORKFLOWS_QUERY_KEY, data.id] })
    },
    onError: (error) => {
      toast.error(
        `Error updating workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    },
  })
}

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => await deleteWorkflowFn({ data: id }),
    onSuccess: (data) => {
      toast.success('Workflow deleted successfully')
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...WORKFLOWS_QUERY_KEY, data.id] })
    },
    onError: (error) => {
      toast.error(
        `Error deleting workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    },
  })
}

export const useUpdateWorkflowNodes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateWorkflowNodesInput) =>
      await updateWorkflowNodesFn({ data: input }),
    onSuccess: (data) => {
      toast.success('Workflow nodes updated successfully')
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...WORKFLOWS_QUERY_KEY, data.id] })
    },
    onError: (error) => {
      toast.error(
        `Error updating workflow nodes: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    },
  })
}
