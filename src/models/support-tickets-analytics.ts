export interface TicketMetricCard {
  label: string
  value: number | string
  trend?: "up" | "down" | "neutral"
  description?: string
  percentage?: number
  chartData?: Array<{ day: string; value: number }>
}

export interface SmartAlert {
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
}

export interface TicketCategoryBreakdown {
  category: string
  ticketCount: number
  avgResolutionTime: string
  negativeSentiment: number
}
export interface SupportAndTickets {
  timeRange: string
  keyMetrics: TicketMetricCard[]
  smartAlerts: SmartAlert[]
  ticketCategoryBreakdown: TicketCategoryBreakdown[]
}
