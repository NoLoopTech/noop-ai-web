export type DateRangeType =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | ""

export type DurationType = "" | "0-5" | "5-10" | "10-20" | "20plus"
export type ScoringType = "Positive" | "Negative" | "Normal"

export const durationOptions = [
  { value: "", label: "All" },
  { value: "0-5", label: "Less than 5 mins" },
  { value: "5-10", label: "5–10 mins" },
  { value: "10-20", label: "10–20 mins" },
  { value: "20plus", label: "More than 20 mins" }
] as const

export const scoringOptions = [
  { value: "positive", label: "Positive" },
  { value: "negative", label: "Negative" },
  { value: "normal", label: "Normal" }
] as const

export const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "last90", label: "Last 90 Days" }
] as const
