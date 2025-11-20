import { z } from 'zod'

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
  MIN_PER_PAGE: 1,
}
export interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

export const paginationParamsSchema = z
  .object({
    page: z.number().min(PAGINATION.DEFAULT_PAGE).default(PAGINATION.DEFAULT_PAGE).optional(),
    perPage: z
      .number()
      .min(PAGINATION.MIN_PER_PAGE)
      .max(PAGINATION.MAX_PER_PAGE)
      .default(PAGINATION.DEFAULT_PER_PAGE)
      .optional(),
    search: z.string().optional(),
  })
  .optional()
