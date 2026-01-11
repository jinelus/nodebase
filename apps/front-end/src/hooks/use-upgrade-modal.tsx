import { useState } from 'react'
import { UpgradeModal } from '@/components/upgrade-modal'

export const useUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleError = (error: Error) => {
    const isForbidden = error.name === 'ForbiddenError' || error.message.includes('FORBIDDEN')

    if (isForbidden) {
      setIsOpen(true)
      return true
    }
    return false
  }

  const modal = <UpgradeModal isOpen={isOpen} onOpenChange={setIsOpen} />

  return { handleError, modal }
}
