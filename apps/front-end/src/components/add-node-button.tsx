import { PlusIcon } from 'lucide-react'
import { memo } from 'react'
import { Button } from './ui/button'

export const AddNodeButton = memo(() => {
  return (
    <Button size={'icon'} variant={'outline'} className="bg-background">
      <PlusIcon className="size-4" />
    </Button>
  )
})

AddNodeButton.displayName = 'AddNodeButton'
