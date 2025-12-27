import { useQueryStates } from 'nuqs'
import { credentialsParams, workflowsParams } from '@/utils/params'

export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams, {
    shallow: false,
  })
}

export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams, {
    shallow: false,
  })
}
