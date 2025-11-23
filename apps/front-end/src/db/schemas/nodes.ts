import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { json, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { workflows } from './workflows'

export const nodeTypes = pgEnum('types', ['INITIAL', 'MANUAL_TRIGGER', 'HTTP_REQUEST'])

export const node = pgTable('node', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),

  type: nodeTypes().default('INITIAL'),
  position: json().notNull(),
  data: json().default('{}'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),

  workflowId: text('workflow_id')
    .notNull()
    .references(() => workflows.id, { onDelete: 'cascade' }),
})

export const nodeRelations = relations(node, ({ one }) => ({
  workflow: one(workflows, {
    fields: [node.workflowId],
    references: [workflows.id],
  }),
}))
