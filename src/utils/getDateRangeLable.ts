import { DashboardRange } from "@/models/dashboard"

/**
 * Returns a human-readable label for a given date range
 */
export default function getRangeLabel(range: string) {
  switch (range) {
    case DashboardRange.WEEK:
      return "From last week"
    case DashboardRange.MONTH:
      return "From last month"
    case DashboardRange.QUARTER:
      return "From last 3 months"
    case DashboardRange.YEAR:
      return "From last year"
    default:
      return ""
  }
}
