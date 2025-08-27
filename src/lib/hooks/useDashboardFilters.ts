import { DashboardRange } from "@/models/dashboard"
import { useSearchParams, useRouter } from "next/navigation"

export function useDashboardFilters() {
  const params = useSearchParams()
  const router = useRouter()

  const dateRange = params.get("range") ?? DashboardRange.WEEK

  function setDateRange(newRange: DashboardRange) {
    const newParams = new URLSearchParams(params)
    newParams.set("range", newRange)
    router.replace(`?${newParams.toString()}`)
  }

  return {
    dateRange,
    setDateRange
  }
}
