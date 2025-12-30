import { createServerFn } from '@tanstack/react-start'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db/connection'
import { credentials } from '@/db/schemas/credentials'
import { activeSubscribedUser } from '@/features/subscriptions/active-subscribed-user'
import { authMiddleware } from '@/routes/_protected'
import { decrypt, encrypt, escapeLike } from '@/utils/fn'
import type { PaginationParams } from '@/utils/pagination'

export const CredentialsTypesValues = ['GEMINI', 'OPENAI', 'ANTHROPIC', 'GROK', 'DEEPSEEK'] as const

export type CredentialsTypes = (typeof CredentialsTypesValues)[number]

const createCredentialsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  value: z.string().min(1, 'Value is required'),
  type: z.enum(CredentialsTypesValues),
})

const updateCredentialsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  value: z.string().optional(),
  type: z.enum(CredentialsTypesValues).optional(),
})

export const createCredentialFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => createCredentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const valueEncrypted = await encrypt(data.value)

    const [credential] = await db
      .insert(credentials)
      .values({
        name: data.name,
        value: valueEncrypted,
        type: data.type,
        userId: authResult.data.userSession.user.id,
      })
      .returning()

    return credential
  })

export const updateCredentialFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => updateCredentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const [existing] = await db
      .select()
      .from(credentials)
      .where(
        and(
          eq(credentials.id, data.id),
          eq(credentials.userId, authResult.data.userSession.user.id),
        ),
      )

    if (!existing) {
      throw new Error('Credential not found or access denied')
    }

    const updatedValues: Partial<z.infer<typeof updateCredentialsSchema>> = {}

    if (data.name !== undefined) {
      updatedValues.name = data.name
    }
    if (data.value !== undefined) {
      const valueEncrypted = await encrypt(data.value)
      updatedValues.value = valueEncrypted
    }
    if (data.type !== undefined) {
      updatedValues.type = data.type
    }

    await db.update(credentials).set(updatedValues).where(eq(credentials.id, data.id))

    return { ...existing, ...updatedValues }
  })

export const deleteCredentialFn = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: credentialId }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const [existing] = await db
      .select()
      .from(credentials)
      .where(
        and(
          eq(credentials.id, credentialId),
          eq(credentials.userId, authResult.data.userSession.user.id),
        ),
      )

    if (!existing) {
      throw new Error('Credential not found or access denied')
    }

    await db.delete(credentials).where(eq(credentials.id, credentialId))

    return { success: true }
  })

export const getUserCredentialsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ context, data }) => {
    if (!context.session.user.id) {
      return {
        credentials: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }

    const { page, perPage, search } = data ?? {}

    const conditions = [eq(credentials.userId, context.session.user.id)]
    if (search) conditions.push(ilike(credentials.name, `%${escapeLike(search)}%`))

    const userCredentials = await db
      .select()
      .from(credentials)
      .where(and(...conditions))
      .offset(((page ?? 1) - 1) * (perPage ?? 10))
      .limit(perPage ?? 10)
      .orderBy(desc(credentials.updatedAt))

    const [{ total }] = await db
      .select({ total: count() })
      .from(credentials)
      .where(and(...conditions))

    const totalPages = Math.ceil(total / (data?.perPage ?? 10))
    const hasNextPage = (data?.page ?? 1) < totalPages
    const hasPreviousPage = (data?.page ?? 1) > 1

    return {
      credentials: userCredentials,
      totalPages,
      totalItems: total,
      currentPage: data?.page ?? 1,
      hasNextPage,
      hasPreviousPage,
    }
  })

export const getCredentialByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id.trim())
  .handler(async ({ data: credentialId }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const [credential] = await db
      .select()
      .from(credentials)
      .where(
        and(
          eq(credentials.id, credentialId),
          eq(credentials.userId, authResult.data.userSession.user.id),
        ),
      )

    if (!credential) {
      throw new Error('Credential not found or access denied')
    }

    const decryptedValue = await decrypt(credential.value)

    return {
      credential: {
        ...credential,
        value: decryptedValue,
      },
    }
  })

export const getCredentialByTypeFn = createServerFn({ method: 'GET' })
  .inputValidator((type: CredentialsTypes) => type)
  .handler(async ({ data: credentialType }) => {
    const authResult = await activeSubscribedUser()

    if (!authResult.success) {
      throw new Error(JSON.stringify(authResult))
    }

    const credentialsByType = await db
      .select({
        id: credentials.id,
        name: credentials.name,
        type: credentials.type,
      })
      .from(credentials)
      .where(
        and(
          eq(credentials.type, credentialType),
          eq(credentials.userId, authResult.data.userSession.user.id),
        ),
      )
      .orderBy(desc(credentials.updatedAt))

    return credentialsByType
  })
