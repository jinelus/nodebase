import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '@/utils/pagination'
import { getExecutionByIdFn, getExecutionsFn } from '../executions'

const EXECUTION_KEY = ['execution']

export const useGetExecution = (id: string) => {
  return useQuery({
    queryKey: [...EXECUTION_KEY, id],
    queryFn: async () => await getExecutionByIdFn({ data: id }),
    enabled: !!id,
  })
}

export const useGetExecutions = (params: PaginationParams) => {
  return queryOptions({
    queryKey: [...EXECUTION_KEY, params],
    queryFn: async () => await getExecutionsFn({ data: params }),
    placeholderData: keepPreviousData,
  })
}
