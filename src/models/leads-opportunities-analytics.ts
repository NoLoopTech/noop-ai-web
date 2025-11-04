export interface LeadMetricCard {
  label: string
  value: number | string
  trend?: "up" | "down" | "neutral"
  description?: string
  percentage?: number
  chartData?: Array<{ day: string; value: number }>
}

export interface LeadIntentDistribution {
  intent: string
  conversations: number
  color: string
  percentage?: number
}

export interface LeadGrowthDataPoint {
  date: string
  leads: number
}

export interface LeadsAndOpportunities {
  timeRange: string
  keyMetrics: LeadMetricCard[]
  mostLeadGeneratedIntents: LeadIntentDistribution[]
  leadGrowthOverTime: LeadGrowthDataPoint[]
}
