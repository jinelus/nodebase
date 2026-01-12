import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { json, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { workflows } from './workflows'

export const executionStatus = pgEnum('execution_status', ['RUNNING', 'SUCCESS', 'FAILED'])

export const executions = pgTable('executions', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  status: executionStatus().default('RUNNING').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  workflowId: text('workflow_id')
    .notNull()
    .references(() => workflows.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  triggerEventId: text('trigger_event_id').notNull(),
  output: json(),
  error: text(),
  errorStack: text(),
})

export const executionsRelations = relations(executions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [executions.workflowId],
    references: [workflows.id],
  }),
  user: one(users, {
    fields: [executions.userId],
    references: [users.id],
  }),
}))
