"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart"
import {
  IconMessages,
  IconClock,
  IconTarget,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconSparkles
} from "@tabler/icons-react"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useConversationsAnalyticsData } from "@/lib/hooks/useConversationsAnalyticsData"
import { DashboardRange } from "@/models/dashboard"
import React, { useState, useMemo } from "react"
import { format, parseISO } from "date-fns"
const confidenceChartConfig = {
  positive: {
    label: "High",
    color: "#2A9D90"
  },
  normal: {
    label: "Medium",
    color: "#F4A462"
  },
  negative: {
    label: "Low",
    color: "#E76E50"
  }
} satisfies ChartConfig

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Total Conversations": IconMessages,
  "Total Intents count": IconTarget,
  "Avg. Conversation Duration": IconClock,
  "Avg. Response Time": IconClock
}

const strokeColorMap: Record<string, string> = {
  "Total Conversations": "var(--chart-stat-green)",
  "Total Intents count": "var(--chart-stat-blue)",
  "Avg. Conversation Duration": "var(--chart-stat-orange)",
  "Avg. Response Time": "var(--chart-stat-purple)"
}

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  chartData?: Array<{ day?: string; value?: number }>
  icon: React.ComponentType<{ size?: number }>
  isLoading?: boolean
  percentage?: number
  trend?: "up" | "down" | "neutral"
}

interface IntentPerformanceTableProps {
  data: Array<{
    intentName: string
    volume: number
    confidenceScore: number
    escalations: number
  }>
  isLoading: boolean
}

const IntentPerformanceTable = ({
  data,
  isLoading
}: IntentPerformanceTableProps) => {
  const [showAll, setShowAll] = useState(false)
  const displayedData = showAll ? data : data.slice(0, 4)
  const hasMore = data.length > 4

  // INFO: Convert intents to snake_case or space-separated text to Title Case
  const toTitleCase = (text: string) => {
    return text
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Intent Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="shine h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-medium">
                      Intent Name
                    </th>
                    <th className="p-3 text-left text-sm font-medium">
                      Volume
                    </th>
                    <th className="p-3 text-left text-sm font-medium">
                      Confidence
                    </th>
                    <th className="p-3 text-left text-sm font-medium">
                      Escalations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3 text-sm">
                        {toTitleCase(item.intentName)}
                      </td>
                      <td className="p-3 text-sm">{item.volume}</td>
                      <td className="p-3 text-sm">
                        <span className="font-medium text-emerald-500">
                          {item.confidenceScore}%
                        </span>
                      </td>
                      <td className="p-3 text-sm">{item.escalations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-primary hover:text-primary/80 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                >
                  {showAll ? "Show Less" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

const StatCard = ({
  label,
  value,
  description,
  chartData = [],
  icon: Icon,
  isLoading,
  percentage,
  trend
}: StatCardProps) => {
  const strokeColor = strokeColorMap[label] || "var(--chart-stat-green)"

  const chartConfig = {
    month: {
      label: "month",
      color: strokeColor
    }
  } satisfies ChartConfig

  // INFO: Extract percentage from description if not provided separately
  const extractedPercentage = React.useMemo(() => {
    if (percentage !== undefined) return percentage
    if (!description) return undefined
    const match = description.match(/(\d+)%/)
    return match ? parseInt(match[1], 10) : undefined
  }, [percentage, description])

  // INFO: Remove percentage from description to avoid duplication
  const cleanDescription = React.useMemo(() => {
    if (!description) return ""
    return description.replace(/(\d+)%\s*/g, "").trim()
  }, [description])

  // INFO: Determine if this is a negative trend (slower/higher is bad, faster/lower is good)
  const isNegativeTrend = React.useMemo(() => {
    if (!description) return false
    const lowerDesc = description.toLowerCase()
    return lowerDesc.includes("slower") || lowerDesc.includes("faster")
  }, [description])

  // INFO: Determine icon direction based on trend and context
  const showUpIcon = trend === "up" ? !isNegativeTrend : isNegativeTrend

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
        <CardTitle className="flex w-full items-center justify-between text-sm font-medium">
          {isLoading ? (
            <div className="shine h-3 w-3/4 rounded-md" />
          ) : (
            <p className="truncate">{label}</p>
          )}

          {isLoading ? (
            <div className="shine h-3 w-5 rounded-md" />
          ) : (
            Icon && <Icon size={16} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%_-_48px)] flex-col justify-between py-2.5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {isLoading ? (
              <div className="shine h-14 w-20 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">
                {typeof value === "number"
                  ? Math.round(value).toLocaleString()
                  : value}
              </div>
            )}

            {isLoading ? (
              <div className="shine h-14 w-20 rounded-md" />
            ) : (
              chartData.length > 0 && (
                <ChartContainer className="w-20" config={chartConfig}>
                  <LineChart accessibilityLayer data={chartData}>
                    <Line
                      dataKey="value"
                      type="linear"
                      stroke="var(--color-month)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              )
            )}
          </div>

          {cleanDescription && !isLoading && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              {extractedPercentage !== undefined &&
                trend &&
                trend !== "neutral" && (
                  <span
                    className="mr-1 flex items-center gap-0.5 font-medium"
                    style={{ color: showUpIcon ? "#34C759" : "#EF4444" }}
                  >
                    {showUpIcon ? (
                      <IconCaretUpFilled size={14} />
                    ) : (
                      <IconCaretDownFilled size={14} />
                    )}
                    {Math.abs(extractedPercentage)}%
                  </span>
                )}
              <span>{cleanDescription}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConversationsTab() {
  const { dateRange, setDateRange } = useDashboardFilters()
  const projectId = useProjectCode() ?? 0
  const { data, isLoading } = useConversationsAnalyticsData(projectId, {
    range: dateRange
  })

  // Get icon for metric label
  const getIcon = (label: string) => iconMap[label] || IconMessages

  // Convert snake_case or space-separated text to Title Case
  const toTitleCase = (text: string) => {
    return text
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // INFO: Determine aggregation type based on date range
  const days = Number(dateRange.replace(/\D/g, ""))
  let aggregation = "daily"
  if (days <= 7) {
    aggregation = "daily"
  } else if (days === 30 || days === 90) {
    aggregation = "weekly"
  } else if (days === 365) {
    aggregation = "monthly"
  } else {
    aggregation = "monthly" // Default for other ranges
  }

  // INFO: Aggregate by week
  const aggregateByWeek = (
    rawData: Array<{
      day: string
      positive: number
      normal: number
      negative: number
    }>
  ) => {
    const weekly: Record<
      string,
      {
        positive: number
        normal: number
        negative: number
        month: string
        week: number
        year: string
      }
    > = {}

    rawData.forEach(item => {
      const date = new Date(item.day)
      if (isNaN(date.getTime())) return
      const month = format(date, "MMM")
      const year = format(date, "yyyy")
      const dayOfMonth = date.getDate()
      const week = Math.ceil(dayOfMonth / 7)
      const key = `${year}-${month}-${week}`
      if (!weekly[key]) {
        weekly[key] = { positive: 0, normal: 0, negative: 0, month, week, year }
      }
      weekly[key].positive += item.positive
      weekly[key].normal += item.normal
      weekly[key].negative += item.negative
    })

    return Object.entries(weekly).map(
      ([_, { positive, normal, negative, month, week, year }]) => ({
        day: month,
        positive,
        normal,
        negative,
        tooltipDate: `${month} Week ${week}, ${year}`
      })
    )
  }

  // INFO: Aggregate by month
  const aggregateByMonth = (
    rawData: Array<{
      day: string
      positive: number
      normal: number
      negative: number
    }>
  ) => {
    const monthly: Record<
      string,
      { positive: number; normal: number; negative: number }
    > = {}

    rawData.forEach(item => {
      const date = new Date(item.day)
      if (isNaN(date.getTime())) return
      const monthKey = format(date, "yyyy-MM")
      if (!monthly[monthKey]) {
        monthly[monthKey] = { positive: 0, normal: 0, negative: 0 }
      }
      monthly[monthKey].positive += item.positive
      monthly[monthKey].normal += item.normal
      monthly[monthKey].negative += item.negative
    })

    const monthlyArray = Object.entries(monthly).map(
      ([month, { positive, normal, negative }]) => {
        const date = parseISO(`${month}-01`)
        return {
          day: format(date, "MMM"),
          positive,
          normal,
          negative,
          tooltipDate: format(date, "MMM yyyy")
        }
      }
    )

    // If long range, reduce to last 12 months
    return monthlyArray.length > 12 ? monthlyArray.slice(-12) : monthlyArray
  }

  // INFO: Process chart data based on aggregation type
  const chartData = useMemo(() => {
    const rawData = data?.confidenceDistributionData ?? []

    if (aggregation === "daily") {
      return rawData.map(item => ({
        ...item,
        day: format(new Date(item.day), "MMM d"),
        tooltipDate: format(new Date(item.day), "MMM d, yyyy")
      }))
    } else if (aggregation === "weekly") {
      return aggregateByWeek(rawData)
    } else {
      return aggregateByMonth(rawData)
    }
  }, [data?.confidenceDistributionData, aggregation])

  // Filter metrics to only show the 4 required ones
  const allowedMetrics = [
    "Total Conversations",
    "Total Intents count",
    "Avg. Conversation Duration",
    "Avg. Response Time"
  ]

  return (
    <div className="space-y-6">
      {/* Title and Date Range Picker */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">
              Conversations & Accuracy
            </h2>
            <p className="text-muted-foreground text-sm">
              Track how well Noop.ai is handling conversations, from accuracy to
              user sentiment
            </p>
          </div>
          <DateRangeDropdown
            value={dateRange as DashboardRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <StatCard
                key={i}
                label=""
                value=""
                icon={IconMessages}
                isLoading={true}
              />
            ))}
          </>
        ) : (
          allowedMetrics.map(metricLabel => {
            const metric = data.keyMetrics.find(m => m.label === metricLabel)
            if (!metric) return null
            return (
              <StatCard
                key={metricLabel}
                label={metric.label}
                value={metric.value}
                description={metric.description}
                icon={getIcon(metric.label)}
                chartData={metric.chartData}
                percentage={metric.percentage}
                trend={metric.trend}
                isLoading={false}
              />
            )
          })
        )}
      </div>

      {/* Confidence Distribution & Smart Highlights */}
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        {/* Confidence Distribution Chart */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="shine h-80 w-full rounded-md" />
            ) : (
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Bar Chart */}
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={320}>
                    <ChartContainer config={confidenceChartConfig}>
                      <BarChart data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          interval={0}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background rounded-lg border p-3 shadow-md">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{ backgroundColor: "#2A9D90" }}
                                        />
                                        <span className="text-xs">High</span>
                                      </div>
                                      <span className="text-xs font-semibold">
                                        {payload[0].payload.positive}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{ backgroundColor: "#F4A462" }}
                                        />
                                        <span className="text-xs">Medium</span>
                                      </div>
                                      <span className="text-xs font-semibold">
                                        {payload[0].payload.normal}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{ backgroundColor: "#E76E50" }}
                                        />
                                        <span className="text-xs">Low</span>
                                      </div>
                                      <span className="text-xs font-semibold">
                                        {payload[0].payload.negative}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar
                          dataKey="positive"
                          stackId="a"
                          fill="#2A9D90"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="normal"
                          stackId="a"
                          fill="#F4A462"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="negative"
                          stackId="a"
                          fill="#E76E50"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </ResponsiveContainer>

                  {/* Custom Legend */}
                  <div className="mt-4 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3"
                        style={{ backgroundColor: "#2A9D90" }}
                      />
                      <span className="text-xs font-medium">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3"
                        style={{ backgroundColor: "#F4A462" }}
                      />
                      <span className="text-xs font-medium">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3"
                        style={{ backgroundColor: "#E76E50" }}
                      />
                      <span className="text-xs font-medium">Low</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Positive Conversations
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#00C3D0" }}
                    >
                      {data?.conversationBreakdown.find(
                        item =>
                          item.label.toLowerCase().includes("positive") ||
                          item.label.toLowerCase().includes("high")
                      )?.count ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Normal Conversations
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#A1A1A1" }}
                    >
                      {data?.conversationBreakdown.find(
                        item =>
                          item.label.toLowerCase().includes("normal") ||
                          item.label.toLowerCase().includes("medium")
                      )?.count ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Negative Conversations
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#FF383C" }}
                    >
                      {data?.conversationBreakdown.find(
                        item =>
                          item.label.toLowerCase().includes("negative") ||
                          item.label.toLowerCase().includes("low")
                      )?.count ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Highlights */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle
              className="text-base font-semibold"
              style={{ color: "#9F9FA1" }}
            >
              Smart Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="shine h-12 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Bullet Points */}
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                      <span>
                        Traffic increased by 32% compared to last week.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                      <span>
                        Returning visitors grew steadily after the product
                        update.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                      <span>
                        Most visits came from organic search around mid-month.
                      </span>
                    </li>
                  </ul>

                  {/* Summary */}
                  <p className="text-muted-foreground text-sm">
                    Overall, the traffic shows a clear upward trend throughout
                    the month, with noticeable spikes during campaign periods
                    and product updates. The steady growth suggests that current
                    strategies are effective.
                  </p>
                </div>

                {/* Learn More Button */}
                <div className="flex justify-end">
                  <button
                    className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(90deg, #63E2FF 0%, #903A7E 100%)"
                    }}
                  >
                    <span>Learn More</span>
                    <IconSparkles size={14} />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emerging Intents & Intent Performance */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Emerging Intents - Narrower Column (1/3) */}
        <Card className="flex flex-col md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Emerging Intents
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="shine h-16 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.emergingIntents.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {toTitleCase(item.intent)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Conversations: {item.conversations}
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold">
                      <span
                        className="flex items-center gap-0.5"
                        style={{
                          color: item.trend === "up" ? "#34C759" : "#EF4444"
                        }}
                      >
                        {item.trend === "up" ? (
                          <IconCaretUpFilled size={14} />
                        ) : (
                          <IconCaretDownFilled size={14} />
                        )}
                        {item.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intent Performance */}
        <IntentPerformanceTable
          data={data?.intentPerformance ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
