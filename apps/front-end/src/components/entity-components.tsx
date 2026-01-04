import { Link } from '@tanstack/react-router'
import {
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'
import { Input } from './ui/input'

type EntityHeaderProps = {
  title: string
  description?: string
  newButtonLabel?: string
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
    <main className="h-full min-h-[80vh] p-4 md:px-10 md:py-6">
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
        {totalPages === 0 ? 'No pages' : `Page ${page} of ${totalPages}`}
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

interface StateViewProps {
  message?: string
}

export const LoadingView: React.FC<StateViewProps> = ({ message }) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4 text-muted-foreground">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      <p className="text-sm">{message ?? `Loading...`}</p>
    </div>
  )
}

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void
}

export const EmptyView: React.FC<EmptyViewProps> = ({ message, onNew }) => {
  return (
    <Empty className="border border-border border-dashed bg-muted">
      <EmptyHeader>
        <EmptyMedia variant={'icon'}>
          <PackageOpenIcon className="size-6 text-muted-foreground" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle> No items </EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} size="sm">
            Add item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

interface EntityListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  getKey?: (item: T, index: number) => string | number
  emptyView?: React.ReactNode
  className?: string
}

export const EntityList = <T,>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) => {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-sm">{emptyView}</div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-y-4', className)}>
      {items.map((item, index) => {
        const key = getKey ? getKey(item, index) : index
        return <div key={key}>{renderItem(item, index)}</div>
      })}
    </div>
  )
}

interface EntityItemProps {
  href: string
  title: string
  subtitle?: React.ReactNode
  image?: React.ReactNode
  actions?: React.ReactNode
  onRemove?: () => void | Promise<void>
  isRemoving?: boolean
  className?: string
}

export const EntityItem: React.FC<EntityItemProps> = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isRemoving) return

    if (onRemove) {
      await onRemove()
    }
  }

  return (
    <Link to={href} preload="intent" className={isRemoving ? 'pointer-events-none' : ''}>
      <Card
        className={cn(
          'cursor-pointer p-4 shadow-none hover:shadow',
          isRemoving && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="font-medium text-base">{title}</CardTitle>
              {subtitle && (
                <CardDescription className="text-muted-foreground text-xs md:text-sm">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex items-center gap-x-4">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isRemoving}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      aria-label="More options"
                    >
                      <MoreVerticalIcon className="size-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleRemove} disabled={isRemoving}>
                      <TrashIcon className="size-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
