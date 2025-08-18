export const TicketStatus = {
  ACTIVE: "active",
  IN_PROGRESS: "in-progress",
  CLOSED: "closed"
} as const
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]

export const TicketPriority = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low"
} as const
export type TicketPriority =
  (typeof TicketPriority)[keyof typeof TicketPriority]

export const TicketType = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
  INFORMATION_REQUEST: "information_request",
  CHANGE_REQUEST: "change_request",
  TECHNICAL_SUPPORT: "technical_support",
  INCIDENT_REPORT: "incident_report",
  FEEDBACK: "feedback",
  COMPLAINTS: "complaints"
} as const
export type TicketType = (typeof TicketType)[keyof typeof TicketType]

export const TicketMethod = {
  MANUAL: "manual",
  AUTOMATED_USER_INQUIRY: "automated-user-inquiry",
  AUTOMATED_LOW_CONFIDENCE: "automated-low-confidence-response",
  AUTOMATED_NEGATIVE_SENTIMENT: "automated-negative-sentiment-detected"
} as const
export type TicketMethod = (typeof TicketMethod)[keyof typeof TicketMethod]
