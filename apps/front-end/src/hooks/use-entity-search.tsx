import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface UseEntitySearchProps<
  T extends {
    search: string
    page: number
  },
> {
  params: T
  setParams: (params: T) => void
  debounceTime?: number
}

export function useEntitySearch<
  T extends {
    search: string
    page: number
  },
>({ params, setParams, debounceTime = 300 }: UseEntitySearchProps<T>) {
  const [searchInput, setSearchInput] = useState(params.search)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (!value) {
      setParams({ ...params, search: null, page: 1 })
    } else {
      setParams({ ...params, search: value, page: 1 })
    }
  }, debounceTime)

  const handleSearchInputChange = (e: string) => {
    setSearchInput(e)
    debouncedSearch(e)
  }

  return {
    searchValue: searchInput,
    setSearchValue: handleSearchInputChange,
  }
}
