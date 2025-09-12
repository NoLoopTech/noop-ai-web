import { DashboardRange } from "@/models/dashboard"

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
