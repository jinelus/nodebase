import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export const getSubscription = () => {
  return useQuery({
    queryKey: ['customer-state'],
    queryFn: async () => {
      const { data } = await authClient.customer.state()
      return data
    },
  })
}

export const useHasActiveSubscription = () => {
  const { data, isLoading, ...rest } = getSubscription()

  const hasActiveSubscription = data?.activeSubscriptions && data.activeSubscriptions.length > 0

  return {
    hasActiveSubscription,
    subscription: data?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  }
}
