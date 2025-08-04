// Option types for dropdowns
export type DateRangeType =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | ""

export type DurationType = "" | "0-5" | "5-10" | "10-20" | "20+"
export type ScoringType = "Positive" | "Negative" | "Normal"
export type LeadScoreType = "" | "Hot" | "Warm" | "Cold"
export type LeadStatusType = "" | "New" | "Contacted" | "Converted" | "Closed"

// Ticket filter types
export type TicketStatusType = "" | "Active" | "In Progress" | "Closed"
export type TicketPriorityType = "" | "High" | "Medium" | "Low"
export type TicketType = "" | "General" | "Bug"
export type TicketMethodType = "" | "Manual" | "Automated"

export const durationOptions = [
  { value: "", label: "All" },
  { value: "0-5", label: "Less than 5 mins" },
  { value: "5-10", label: "5–10 mins" },
  { value: "10-20", label: "10–20 mins" },
  { value: "20+", label: "More than 20 mins" }
] as const

export const scoringOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
  { value: "Normal", label: "Normal" }
] as const

export const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "last90", label: "Last 90 Days" }
] as const

export const leadScoreOptions = [
  { value: "", label: "All Scores" },
  { value: "Hot", label: "Hot" },
  { value: "Warm", label: "Warm" },
  { value: "Cold", label: "Cold" }
] as const

export const leadStatusOptions = [
  { value: "", label: "All Status" },
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Converted", label: "Converted" },
  { value: "Closed", label: "Closed" }
] as const

// Ticket filter options
export const ticketStatusOptions = [
  { value: "Active", label: "Active" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" }
]

export const ticketPriorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" }
]

export const ticketTypeOptions = [
  { value: "General", label: "General" },
  { value: "Bug", label: "Bug" }
]

export const ticketMethodOptions = [
  { value: "Manual", label: "Manual" },
  { value: "Automated", label: "Automated" }
]
