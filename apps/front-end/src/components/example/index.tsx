import { useMutation } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { aiProvider } from './ai-provider'
import { triggerServerFn } from './fn'

export function TriggerExample() {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () => triggerServerFn({ data: { name: 'hello-world' } }),
  })

  const executeAiProviderTest = useMutation({
    mutationFn: () => aiProvider({ data: { prompt: 'What is love?' } }),
  })

  return (
    <div className="flex items-center gap-14">
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
      <div className="mt-6 space-y-4">
        <Button
          onClick={() => executeAiProviderTest.mutate()}
          disabled={executeAiProviderTest.isPending}
        >
          Run AI Provider Test
        </Button>
        {executeAiProviderTest.isPending && <p>Generating text...</p>}
        {executeAiProviderTest.isSuccess && (
          <div>
            <p>Generated Text:</p>
            <pre>{executeAiProviderTest.data.id}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
