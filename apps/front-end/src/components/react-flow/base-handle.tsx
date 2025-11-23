import { Handle, type HandleProps } from '@xyflow/react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type BaseHandleProps = HandleProps

export function BaseHandle({ className, children, ...props }: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        'border! size-1! rounded-full! border-border! bg-muted-foreground! transition',
        className,
      )}
    >
      {children}
    </Handle>
  )
}
