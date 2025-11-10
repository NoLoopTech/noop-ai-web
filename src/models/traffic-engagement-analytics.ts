export interface TrafficMetricCard {
  label: string
  value: number | string
  trend?: "up" | "down" | "neutral"
  percentage?: number
  description?: string
  chartData?: Array<{ day: string; value: number }>
}

export interface TrafficTrendDataPoint {
  week: string
  newVisitors: number
  returningVisitors: number
}

export interface TrafficTrend {
  trendPercentage: number
  trendDirection: string
  lastMonthChange: number
  avgVisitDuration: string
  newVsReturning: {
    returnUsers: number
    newUsers: number
  }
  data: TrafficTrendDataPoint[]
}

export interface CountryData {
  countryCode: string
  percentage: number
  changePercentage: number
  trend: string
}

export interface TrafficAndEngagement {
  keyMetrics: TrafficMetricCard[]
  trafficTrend: TrafficTrend
  topCountries: CountryData[]
}
