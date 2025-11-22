import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { connections } from './connections'
import { node } from './nodes'
import { users } from './users'

export const workflows = pgTable('workflows', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const workflowsRelations = relations(workflows, ({ many, one }) => ({
  node: many(node),
  connections: many(connections),
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
}))
