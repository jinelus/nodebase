import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ManualTriggerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ManualTriggerDialog: React.FC<ManualTriggerDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>Configure settings for the manual trigger here.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            This manual trigger can be used to start workflows manually. No configuration available
            yet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
