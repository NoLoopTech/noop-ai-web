import { useCallback, useEffect, useMemo, useState } from "react"

type Accessor<T> = ((item: T) => string) | Array<keyof T>

export interface UseSearchOptions<T> {
  keys?: Accessor<T>
  caseSensitive?: boolean
  initialQuery?: string
  debounceMs?: number
}

export interface UseSearchReturn<T> {
  query: string
  setQuery: (q: string) => void
  clear: () => void
  filteredItems: T[]
  resultsCount: number
  hasResults: boolean
}

export default function useSearch<T>(
  items: T[],
  options: UseSearchOptions<T> = {}
): UseSearchReturn<T> {
  const {
    keys,
    caseSensitive = false,
    initialQuery = "",
    debounceMs = 200
  } = options

  const [query, setQuery] = useState<string>(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery)
  const accessor = useCallback(
    (item: T) => {
      if (typeof keys === "function") return keys(item) as string

      if (Array.isArray(keys) && keys.length > 0) {
        return (keys as Array<keyof T>)
          .map(k => {
            const v = (item as T)[k]
            return v == null ? "" : String(v)
          })
          .join(" ")
      }

      try {
        return typeof item === "string" ? item : JSON.stringify(item)
      } catch {
        return String(item)
      }
    },
    [keys]
  )

  const normalizedQuery = useMemo(() => {
    const q = (debouncedQuery ?? "").trim()
    return caseSensitive ? q : q.toLowerCase()
  }, [debouncedQuery, caseSensitive])

  useEffect(() => {
    if (debounceMs <= 0) {
      setDebouncedQuery(query)
      return
    }

    const id = setTimeout(() => setDebouncedQuery(query), debounceMs)
    return () => clearTimeout(id)
  }, [query, debounceMs])

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return items

    return items.filter(item => {
      const haystack = accessor(item)
      const hay = caseSensitive ? haystack : haystack.toLowerCase()
      return hay.includes(normalizedQuery)
    })
  }, [items, accessor, normalizedQuery, caseSensitive])

  const clear = useCallback(() => setQuery(""), [])

  return {
    query,
    setQuery,
    clear,
    filteredItems,
    resultsCount: filteredItems.length,
    hasResults: filteredItems.length > 0
  }
}
