import { useQuery } from '@tanstack/react-query'
import { activeSubscription } from '../active-subscribed-user'

export const getSubscription = () => {
  return useQuery({
    queryKey: ['customer-state'],
    queryFn: async () => {
      const { success } = await activeSubscription()

      return { success }
    },
  })
}

export const useHasActiveSubscription = () => {
  const { data, isLoading } = getSubscription()

  const hasActiveSubscription = data?.success ?? false

  return {
    hasActiveSubscription,
    isLoading,
  }
}
