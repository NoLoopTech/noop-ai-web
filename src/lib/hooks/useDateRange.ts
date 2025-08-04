import { useState, useMemo, useCallback } from "react"
import { type DateRangeType } from "@/models/filterOptions"

interface UseDateRangeOptions {
  initialDays?: number
  initialRangeType?: DateRangeType
}

export function useDateRange(options: UseDateRangeOptions = {}) {
  const { initialDays = 6, initialRangeType = "last7" } = options

  // Calculate initial dates
  const getInitialDates = useCallback(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - initialDays)

    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: today.toISOString().slice(0, 10)
    }
  }, [initialDays])

  const { startDate: initialStartDate, endDate: initialEndDate } =
    getInitialDates()

  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [selectedDateRangeType, setSelectedDateRangeType] =
    useState<DateRangeType>(initialRangeType)

  // Helper to format date as yyyy-mm-dd
  const formatDateISO = useCallback((d: Date): string => {
    return d.toISOString().slice(0, 10)
  }, [])

  // Memoized formatted date range for display
  const formattedDateRange = useMemo(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const format = (d: Date): string =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })

    return startDate === endDate
      ? format(start)
      : `${format(start)} - ${format(end)}`
  }, [startDate, endDate])

  // Handle predefined date range changes
  const handleDateRangeChange = useCallback(
    (value: DateRangeType): void => {
      setSelectedDateRangeType(value)

      // If custom is selected, don't change dates (future implementation)
      if (value === "custom") {
        return
      }

      const today = new Date()
      const start = new Date(today)
      const end = new Date(today)

      switch (value) {
        case "today":
          // start and end are already today
          break
        case "yesterday":
          start.setDate(today.getDate() - 1)
          end.setDate(today.getDate() - 1)
          break
        case "last7":
          start.setDate(today.getDate() - 6)
          break
        case "last30":
          start.setDate(today.getDate() - 29)
          break
        case "last90":
          start.setDate(today.getDate() - 89)
          break
        case "":
          // For empty string, could represent "All" - keep current dates or reset
          return
        default:
          return
      }

      setStartDate(formatDateISO(start))
      setEndDate(formatDateISO(end))
    },
    [formatDateISO]
  )

  // Handle dropdown change (wrapper for type safety)
  const handleDateDropdownChange = useCallback(
    (val: string): void => {
      handleDateRangeChange(val as DateRangeType)
    },
    [handleDateRangeChange]
  )

  // Manual date setters for custom range (future use)
  const setCustomStartDate = useCallback((date: string): void => {
    setStartDate(date)
    setSelectedDateRangeType("custom")
  }, [])

  const setCustomEndDate = useCallback((date: string): void => {
    setEndDate(date)
    setSelectedDateRangeType("custom")
  }, [])

  // Reset to initial state
  const resetDateRange = useCallback(() => {
    const { startDate: resetStart, endDate: resetEnd } = getInitialDates()
    setStartDate(resetStart)
    setEndDate(resetEnd)
    setSelectedDateRangeType(initialRangeType)
  }, [getInitialDates, initialRangeType])

  // Check if current selection is a custom range
  const isCustomRange = useMemo(() => {
    return selectedDateRangeType === "custom"
  }, [selectedDateRangeType])

  // Validate date range
  const isValidDateRange = useMemo(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()

    return start <= end && end <= today
  }, [startDate, endDate])

  return {
    // Current state
    startDate,
    endDate,
    selectedDateRangeType,
    formattedDateRange,
    isCustomRange,
    isValidDateRange,

    // Actions
    handleDateRangeChange,
    handleDateDropdownChange,
    setCustomStartDate,
    setCustomEndDate,
    resetDateRange,

    // Utilities (kept for backward compatibility)
    getFormattedDateRange: () => formattedDateRange,
    formatDateISO
  }
}
