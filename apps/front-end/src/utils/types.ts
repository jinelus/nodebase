import type { InferSelectModel } from 'drizzle-orm'
import type { workflows } from '@/db/schemas'

export type WorkflowSelect = InferSelectModel<typeof workflows>
