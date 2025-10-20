"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Sector
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart"
import {
  IconUsers,
  IconPercentage,
  IconClock,
  IconSparkles,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconTargetArrow
} from "@tabler/icons-react"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useLeadsOpportunitiesData } from "@/lib/hooks/useLeadsOpportunitiesData"
import { DashboardRange } from "@/models/dashboard"
import React, { useMemo, useCallback } from "react"
import { format, parseISO } from "date-fns"

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Total Leads": IconUsers,
  "Lead Conversion Rate": IconPercentage,
  "Lead Generation Rate": IconTargetArrow,
  "Avg. Lead Response Time": IconClock
}

const strokeColorMap: Record<string, string> = {
  "Total Leads": "var(--chart-stat-green)",
  "Lead Conversion Rate": "var(--chart-stat-orange)",
  "Lead Generation Rate": "var(--chart-stat-orange)",
  "Avg. Lead Response Time": "var(--chart-stat-purple)"
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

const StatCard = React.memo(function StatCard({
  label,
  value,
  description,
  chartData = [],
  icon: Icon,
  isLoading,
  percentage,
  trend
}: StatCardProps) {
  const strokeColor = strokeColorMap[label] || "var(--chart-stat-green)"

  const chartConfig = {
    month: {
      label: "month",
      color: strokeColor
    }
  } satisfies ChartConfig

  const extractedPercentage = React.useMemo(() => {
    if (percentage !== undefined) return percentage
    if (!description) return undefined
    const match = description.match(/(\d+)%/)
    return match ? parseInt(match[1], 10) : undefined
  }, [percentage, description])

  const cleanDescription = React.useMemo(() => {
    if (!description) return ""
    return description.replace(/(\d+)%\s*/g, "").trim()
  }, [description])

  const isNegativeTrend = React.useMemo(() => {
    if (!description) return false
    const lowerDesc = description.toLowerCase()
    return lowerDesc.includes("slower") || lowerDesc.includes("faster")
  }, [description])

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
                trend !== "neutral" &&
                label !== "Avg. Lead Response Time" && (
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
              <span
                style={
                  label === "Avg. Lead Response Time"
                    ? { color: "#EF4444" }
                    : undefined
                }
              >
                {cleanDescription}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

export default function LeadsOpportunitiesTab() {
  const { dateRange, setDateRange } = useDashboardFilters()
  const projectId = useProjectCode() ?? 0
  const { data, isLoading } = useLeadsOpportunitiesData(projectId, {
    range: dateRange
  })

  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  )

  const getIcon = (label: string) => iconMap[label] || IconUsers

  // Calculate total conversations for donut center
  const totalConversations = useMemo(() => {
    if (!data?.mostLeadGeneratedIntents) return 0
    return data.mostLeadGeneratedIntents.reduce(
      (sum, item) => sum + item.conversations,
      0
    )
  }, [data?.mostLeadGeneratedIntents])

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
  const aggregateByWeek = useCallback(
    (
      rawData: Array<{
        date: string
        leads: number
      }>
    ) => {
      const weekly: Record<
        string,
        {
          leads: number
          month: string
          week: number
          year: string
        }
      > = {}

      rawData.forEach(item => {
        const date = new Date(item.date)
        if (isNaN(date.getTime())) return
        const month = format(date, "MMM")
        const year = format(date, "yyyy")
        const dayOfMonth = date.getDate()
        const week = Math.ceil(dayOfMonth / 7)
        const key = `${year}-${month}-${week}`
        if (!weekly[key]) {
          weekly[key] = { leads: 0, month, week, year }
        }
        weekly[key].leads += item.leads
      })

      return Object.entries(weekly).map(
        ([_, { leads, month, week, year }]) => ({
          date: month,
          leads,
          tooltipDate: `${month} Week ${week}, ${year}`
        })
      )
    },
    []
  )

  // INFO: Aggregate by month
  const aggregateByMonth = useCallback(
    (
      rawData: Array<{
        date: string
        leads: number
      }>
    ) => {
      const monthly: Record<string, { leads: number }> = {}

      rawData.forEach(item => {
        const date = new Date(item.date)
        if (isNaN(date.getTime())) return
        const monthKey = format(date, "yyyy-MM")
        if (!monthly[monthKey]) {
          monthly[monthKey] = { leads: 0 }
        }
        monthly[monthKey].leads += item.leads
      })

      const monthlyArray = Object.entries(monthly).map(([month, { leads }]) => {
        const date = parseISO(`${month}-01`)
        return {
          date: format(date, "MMM"),
          leads,
          tooltipDate: format(date, "MMM yyyy")
        }
      })

      // If long range, reduce to last 12 months
      return monthlyArray.length > 12 ? monthlyArray.slice(-12) : monthlyArray
    },
    []
  )

  // INFO: Process chart data based on aggregation type
  const leadGrowthChartData = useMemo(() => {
    const rawData = data?.leadGrowthOverTime ?? []

    if (aggregation === "daily") {
      return rawData.map(item => ({
        ...item,
        date: format(new Date(item.date), "MMM d"),
        tooltipDate: format(new Date(item.date), "MMM d, yyyy")
      }))
    } else if (aggregation === "weekly") {
      return aggregateByWeek(rawData)
    } else {
      return aggregateByMonth(rawData)
    }
  }, [data?.leadGrowthOverTime, aggregation, aggregateByWeek, aggregateByMonth])

  // Filter metrics to only show the 4 required ones
  const allowedMetrics = [
    "Total Leads",
    "Lead Conversion Rate",
    "Lead Generation Rate",
    "Avg. Lead Response Time"
  ]

  return (
    <div className="space-y-6">
      {/* Title and Date Range Picker */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">
              Leads & Opportunities
            </h2>
            <p className="text-muted-foreground text-sm">
              Track how conversations turn into business opportunities and
              uncover growth signals
            </p>
          </div>
          <DateRangeDropdown
            value={dateRange as DashboardRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Metric Cards (2x2 on left) and Donut Chart (on right) */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: Metric Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isLoading || !data ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <StatCard
                  key={i}
                  label=""
                  value=""
                  icon={IconUsers}
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

        {/* Right: Donut Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Most Lead Generated Intents
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="shine h-80 w-full rounded-md" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-6">
                {/* Donut Chart and Legend Container */}
                <div className="flex w-full items-center justify-center gap-12">
                  {/* Donut Chart */}
                  <div
                    className="relative flex-shrink-0"
                    style={{ width: "280px", height: "280px" }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.mostLeadGeneratedIntents ?? []}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={130}
                          paddingAngle={0}
                          dataKey="conversations"
                          startAngle={90}
                          endAngle={-270}
                          activeIndex={activeIndex}
                          activeShape={(props: unknown) => {
                            const p = props as {
                              cx: number
                              cy: number
                              innerRadius: number
                              outerRadius: number
                              startAngle: number
                              endAngle: number
                              fill: string
                            }
                            return (
                              <g>
                                {/* Main sector with increased radius */}
                                <Sector
                                  {...p}
                                  outerRadius={p.outerRadius + 10}
                                  stroke="hsl(var(--background))"
                                  strokeWidth={2}
                                />
                                {/* Highlight band effect that works in both themes */}
                                <Sector
                                  cx={p.cx}
                                  cy={p.cy}
                                  innerRadius={p.outerRadius - 10}
                                  outerRadius={p.outerRadius - 8}
                                  startAngle={p.startAngle}
                                  endAngle={p.endAngle}
                                  fill="white"
                                  opacity={0.8}
                                />
                              </g>
                            )
                          }}
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(undefined)}
                        >
                          {(data?.mostLeadGeneratedIntents ?? []).map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="hsl(var(--background))"
                                strokeWidth={2}
                                style={{ cursor: "pointer" }}
                              />
                            )
                          )}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                      <div className="text-3xl font-bold">
                        {totalConversations}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Conversations
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3">
                    {(data?.mostLeadGeneratedIntents ?? []).map(
                      (item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {item.intent
                                .replace(/_/g, " ")
                                .split(" ")
                                .map(
                                  word =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Growth Over Time Chart & Smart Highlights */}
      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        {/* Lead Growth Over Time Chart */}
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Lead Growth Over Time
            </CardTitle>
            <button
              className="relative flex items-center gap-2 rounded-full bg-transparent px-4 py-1.5 text-xs font-medium text-zinc-500 transition-all hover:opacity-80"
              style={{
                background:
                  "linear-gradient(var(--background), var(--background)) padding-box, linear-gradient(90deg, #63E2FF 0%, #903A7E 100%) border-box",
                border: "2px solid transparent"
              }}
            >
              <span>AI Forecast</span>
              <IconSparkles size={14} />
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="shine h-80 w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <ChartContainer
                  config={{
                    leads: {
                      label: "Leads",
                      color: "var(--chart-stat-green)"
                    }
                  }}
                >
                  <LineChart data={leadGrowthChartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <ChartTooltip
                      cursor={{
                        stroke: "var(--chart-stat-green)",
                        strokeWidth: 1
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const tooltipDate =
                            payload[0].payload.tooltipDate ||
                            payload[0].payload.date
                          return (
                            <div className="bg-background rounded-lg border p-3 shadow-md">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium">
                                  {tooltipDate}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: "var(--chart-stat-green)"
                                    }}
                                  />
                                  <span className="text-xs">
                                    Leads:{" "}
                                    <span className="font-semibold">
                                      {payload[0].value}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="var(--chart-stat-green)"
                      strokeWidth={2}
                      dot={{ fill: "var(--chart-stat-green)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Smart Highlights */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Smart Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="shine h-12 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="relative flex flex-1 flex-col justify-between space-y-4 overflow-clip rounded-lg">
                <h2 className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold text-zinc-600">
                  Coming soon
                </h2>
                <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm"></span>
                <div className="space-y-4">
                  {/* Bullet Points */}
                  <ul className="space-y-2.5">
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
                <div className="flex justify-end pt-2">
                  <button
                    className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(90deg, #63E2FF 0%, #903A7E 100%)"
                    }}
                  >
                    <span>Learn more</span>
                    <IconSparkles size={14} />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
