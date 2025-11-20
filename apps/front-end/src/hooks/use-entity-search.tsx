import { useState } from 'react'

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

  const debouncedSearch = debounce((value: string) => {
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

function debounce(fn: (searchValue: string) => void, delay: number) {
  let timeoutId: NodeJS.Timeout

  return (value: string) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(value), delay)
  }
}
