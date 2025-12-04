import type { InferSelectModel } from 'drizzle-orm'
import type { nodeTypes, workflows } from '@/db/schemas'

export type WorkflowSelect = InferSelectModel<typeof workflows>

export type NodeType = (typeof nodeTypes.enumValues)[number]
