import { createId } from '@paralleldrive/cuid2'
import { useReactFlow } from '@xyflow/react'
import { GlobeIcon, MousePointerIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { NodeType } from './node-component'
import { Separator } from './ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

export type NodeTypeOption = {
  type: NodeType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }> | string
}

const triggerNodes: NodeTypeOption[] = [
  {
    type: 'MANUAL_TRIGGER',
    label: 'Trigger manually',
    description: 'Runs the flow on clicking a button, Good for getting started quickly.',
    icon: MousePointerIcon,
  },
  {
    type: 'GOOGLE_FORM_TRIGGER',
    label: 'Google Form Trigger',
    description: 'Trigger the workflow when a Google Form is submitted.',
    icon: '/logos/google-forms.svg',
  },
  {
    type: 'STRIPE_TRIGGER',
    label: 'Stripe Trigger',
    description: 'Trigger the workflow when a Stripe event is captured.',
    icon: '/logos/stripe.svg',
  },
]

const executionNodes: NodeTypeOption[] = [
  {
    type: 'HTTP_REQUEST',
    label: 'HTTP Request',
    description: 'Makes an HTTP request',
    icon: GlobeIcon,
  },
]

interface NodeSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({ open, onOpenChange, children }) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeSelect = (selectedNode: NodeTypeOption) => {
    if (selectedNode.type === 'MANUAL_TRIGGER') {
      const existingNodes = getNodes()
      const hasManualTrigger = existingNodes.some((node) => node.type === 'MANUAL_TRIGGER')

      if (hasManualTrigger) {
        toast.error('Only one manual trigger node is allowed per workflow.')
        return
      }
    }

    setNodes((nds) => {
      const hasInitialTrigger = nds.some((node) => node.type === 'INITIAL')

      const positionX = window.innerWidth / 2
      const positionY = window.innerHeight / 2

      const position = screenToFlowPosition({
        x: positionX + (Math.random() - 0.5) * 200,
        y: positionY + (Math.random() - 0.5) * 200,
      })

      const newNode = {
        id: createId(),
        data: {},
        position,
        type: selectedNode.type,
      }

      if (hasInitialTrigger) {
        return [newNode]
      }

      return [...nds, newNode]
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts the workflow. Choose one of the following options to get
            started.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((node) => {
            const Icon = node.icon

            return (
              <button
                key={node.type}
                className="h-auto w-full cursor-pointer border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
                onClick={() => handleNodeSelect(node)}
              >
                <div className="flex w-full items-center gap-6 overflow-hidden">
                  {typeof node.icon === 'string' ? (
                    <img
                      src={node.icon}
                      alt={node.label}
                      className="size-5 rounded-sm object-contain"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-start text-muted-foreground text-xs">
                      {node.description}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((node) => {
            const Icon = node.icon

            return (
              <button
                key={node.type}
                className="h-auto w-full cursor-pointer border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
                onClick={() => handleNodeSelect(node)}
              >
                <div className="flex w-full items-center gap-6 overflow-hidden">
                  {typeof node.icon === 'string' ? (
                    <img
                      src={node.icon}
                      alt={node.label}
                      className="size-5 rounded-sm object-contain"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-start text-muted-foreground text-xs">
                      {node.description}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
