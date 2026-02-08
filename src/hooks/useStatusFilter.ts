import { useCallback, useMemo, useState } from "react"

export interface UseStatusFilterOptions<T> {
  statusKey?: keyof T | string
  allowedValues?: string[]
  initial?: string
}

export interface UseStatusFilterReturn<T> {
  statusFilter: string
  setStatusFilter: (s: string) => void
  clear: () => void
  filteredItems: T[]
  resultsCount: number
  hasFilter: boolean
  allowedValues: string[]
}

export default function useStatusFilter<T>(
  items: T[],
  options: UseStatusFilterOptions<T> = {}
): UseStatusFilterReturn<T> {
  const {
    statusKey = "status",
    allowedValues = ["default", "new", "edited", "trained"],
    initial = "default"
  } = options

  const [statusFilter, setStatusFilter] = useState<string>(initial)

  const clear = useCallback(() => setStatusFilter("default"), [])

  const filteredItems = useMemo(() => {
    if (statusFilter === "default") return items

    const key = String(statusKey)
    return items.filter(item => {
      const value = (item as unknown as Record<string, unknown>)[key]
      const s = value == null ? "new" : String(value)
      return s === statusFilter
    })
  }, [items, statusFilter, statusKey])

  return {
    statusFilter,
    setStatusFilter,
    clear,
    filteredItems,
    resultsCount: filteredItems.length,
    hasFilter: statusFilter !== "default",
    allowedValues
  }
}
