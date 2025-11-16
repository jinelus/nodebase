import { useState } from 'react'
import { UpgradeModal } from '@/components/upgrade-modal'

export const useUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleError = (error: Error) => {
    const errorData = JSON.parse(error.message)

    if (errorData.code === 'FORBIDDEN') {
      setIsOpen(true)
      return true
    }
    return false
  }

  const modal = <UpgradeModal isOpen={isOpen} onOpenChange={setIsOpen} />

  return { handleError, modal }
}
