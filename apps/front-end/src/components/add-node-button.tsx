import { PlusIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { NodeSelector } from './node-selector'
import { Button } from './ui/button'

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false)

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button size={'icon'} variant={'outline'} className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  )
})

AddNodeButton.displayName = 'AddNodeButton'
