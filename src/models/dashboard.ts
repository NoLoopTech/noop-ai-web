export enum DashboardRange {
  WEEK = "7",
  MONTH = "30",
  QUARTER = "90",
  YEAR = "365"
}

export const dateRangeOptions = [
  { value: DashboardRange.WEEK, label: "Last 7 days" },
  { value: DashboardRange.MONTH, label: "Last 30 days" },
  { value: DashboardRange.QUARTER, label: "Last 90 days" },
  { value: DashboardRange.YEAR, label: "Last 365 days" }
]
