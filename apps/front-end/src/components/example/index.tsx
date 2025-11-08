import { useMutation } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { triggerServerFn } from './fn'

export function TriggerExample() {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () => triggerServerFn({ data: { name: 'hello-world' } }),
  })

  return (
    <div className="mt-6 space-y-4">
      <Button onClick={() => mutate()} disabled={isPending}>
        Run Trigger Task
        {isError && <span>Error occurred</span>}
      </Button>

      {isPending && <p>Triggering task...</p>}
      {isSuccess && (
        <div>
          <p>Task triggered successfully!</p>
        </div>
      )}
    </div>
  )
}
