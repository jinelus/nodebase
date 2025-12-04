import { createFileRoute } from '@tanstack/react-router'
import { Provider } from 'jotai'
import { EditorContainer, EditorHeader } from '@/components/sections/editor'

export const Route = createFileRoute('/_protected/_editor/workflows/$workflowId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workflowId } = Route.useParams()

  return (
    <Provider>
      <main className="flex h-screen flex-col">
        <EditorHeader workflowId={workflowId} />
        <EditorContainer workflowId={workflowId} />
      </main>
    </Provider>
  )
}
