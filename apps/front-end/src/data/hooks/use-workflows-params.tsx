import { useQueryStates } from 'nuqs'
import { credentialsParams, executionsParams, workflowsParams } from '@/utils/params'

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

export const useExecutionsParams = () => {
  return useQueryStates(executionsParams, {
    shallow: false,
  })
}
