import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { node } from './nodes'
import { workflows } from './workflows'

export const connections = pgTable(
  'connections',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    fromOutput: text('from_output').default('main'),
    toInput: text('to_input').default('main'),

    workflowId: text('workflow_id')
      .notNull()
      .references(() => workflows.id, { onDelete: 'cascade' }),
    fromNodeId: text('from_node_id')
      .notNull()
      .references(() => node.id, { onDelete: 'cascade' }),
    toNodeId: text('to_node_id')
      .notNull()
      .references(() => node.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('unique_connextion_idx').on(
      table.fromOutput,
      table.toInput,
      table.fromNodeId,
      table.toNodeId,
    ),
  ],
)

export const connectionsRelations = relations(connections, ({ one }) => ({
  workflow: one(workflows, {
    fields: [connections.workflowId],
    references: [workflows.id],
  }),
  fromNode: one(node, {
    fields: [connections.fromNodeId],
    references: [node.id],
    relationName: 'fromNode',
  }),
  toNode: one(node, {
    fields: [connections.toNodeId],
    references: [node.id],
    relationName: 'toNode',
  }),
}))
