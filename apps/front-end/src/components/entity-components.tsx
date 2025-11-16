import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from './ui/button'

type EntityHeaderProps = {
  title: string
  description?: string
  newButtonLabel: string
  disabled?: boolean
  isCreating?: boolean
} & (
  | { onNewClick: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNewClick?: never }
  | { newButtonHref?: never; onNewClick?: never }
)

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  newButtonLabel,
  description,
  disabled,
  isCreating,
  newButtonHref,
  onNewClick,
}) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col gap-px">
        <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
        {description && <p className="text-muted-foreground text-xs md:text-sm">{description}</p>}
      </div>
      {onNewClick && !newButtonHref && (
        <Button disabled={disabled || isCreating} onClick={onNewClick} size={'sm'}>
          <PlusIcon />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNewClick && (
        <Button size={'sm'} asChild>
          <Link to={newButtonHref} preload="intent" className="flex flex-row items-center gap-2">
            <PlusIcon />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}

type EntityContainerProps = {
  children: React.ReactNode
  header?: React.ReactNode
  search?: React.ReactNode
  pagination?: React.ReactNode
}

export const EntityContainer = ({ children, header, search, pagination }: EntityContainerProps) => {
  return (
    <main className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full flex-col gap-8">
        {header}
        <div className="flex h-full flex-col gap-y-4">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </main>
  )
}
