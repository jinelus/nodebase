import { useQueryStates } from 'nuqs'
import { workflowsParams } from '@/utils/params'

export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams, {
    shallow: false,
  })
}
