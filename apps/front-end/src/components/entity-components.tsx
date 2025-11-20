import { Link } from '@tanstack/react-router'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

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

interface EntitySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const EntitySearch: React.FC<EntitySearchProps> = ({
  value,
  onChange,
  placeholder = 'Search',
}) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-3.5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="max-w-[200px] border border-border bg-transparent pl-8 shadow-none"
      />
    </div>
  )
}

interface EntityPaginationProps {
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
  disabled?: boolean
}

export const EntityPagination: React.FC<EntityPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <div className="flex-1 text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          size={'sm'}
          variant={'outline'}
        >
          Previous
        </Button>
        <Button
          disabled={disabled || page >= totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          size={'sm'}
          variant={'outline'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
