export interface KeyMetricCard {
  label: string
  value: number | string
  trend?: "up" | "down" | "neutral"
  description?: string
  percentage?: number
  chartData?: Array<{ day: string; value: number }>
}

export interface ConfidenceDistributionData {
  day: string
  positive: number
  normal: number
  negative: number
}

export interface ConversationBreakdown {
  label: string
  count: number
  color?: string
}

export interface EmergingIntent {
  intent: string
  conversations: number
  growth: number
  trend: "up" | "down"
}

export interface IntentPerformance {
  intentName: string
  volume: number
  confidenceScore: number
  escalations: number
}

export interface Highlight {
  text: string
}

export interface ConversationsAndAccuracy {
  timeRange: string
  keyMetrics: KeyMetricCard[]
  confidenceDistributionData: ConfidenceDistributionData[]
  confidenceLegend: Array<{
    level: string
    count: number
    color: string
  }>
  conversationBreakdown: ConversationBreakdown[]
  smartHighlights: Highlight[]
  emergingIntents: EmergingIntent[]
  intentPerformance: IntentPerformance[]
}
