import { parseAsInteger, parseAsString } from 'nuqs'
import { PAGINATION } from './pagination'

export const workflowsParams = {
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  perPage: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PER_PAGE)
    .withOptions({ clearOnDefault: true }),
}

export const credentialsParams = {
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  perPage: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PER_PAGE)
    .withOptions({ clearOnDefault: true }),
}

export const executionsParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  perPage: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PER_PAGE)
    .withOptions({ clearOnDefault: true }),
}
