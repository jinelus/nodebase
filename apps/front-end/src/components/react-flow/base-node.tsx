import { CheckIcon, LoaderIcon, XCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import type { NodeStatus } from './node-status-indicator'

interface BaseNodeProps extends ComponentProps<'div'> {
  status?: NodeStatus
}

export function BaseNode({ status, className, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        'relative rounded-sm border border-muted-foreground bg-card text-card-foreground hover:bg-accent',
        'hover:ring-1',
        className,
      )}
      {...props}
    >
      {props.children}
      {status === 'ERROR' && (
        <XCircleIcon className="absolute right-0.5 bottom-0.5 size-2 stroke-3 text-destructive" />
      )}
      {status === 'SUCCESS' && (
        <CheckIcon className="absolute right-0.5 bottom-0.5 size-2 stroke-3 text-green-700" />
      )}
      {status === 'LOADING' && (
        <LoaderIcon className="-right-0.5 -bottom-0.5 absolute size-2 animate-spin stroke-3 text-blue-700" />
      )}
    </div>
  )
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({ className, ...props }: ComponentProps<'header'>) {
  return (
    <header
      {...props}
      className={cn(
        '-mb-1 mx-0 my-0 flex flex-row items-center justify-between gap-2 px-3 py-2',
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  )
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn('user-select-none flex-1 font-semibold', className)}
      {...props}
    />
  )
}

export function BaseNodeContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="base-node-content"
      className={cn('flex flex-col gap-y-2 p-3', className)}
      {...props}
    />
  )
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn('flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3', className)}
      {...props}
    />
  )
}
