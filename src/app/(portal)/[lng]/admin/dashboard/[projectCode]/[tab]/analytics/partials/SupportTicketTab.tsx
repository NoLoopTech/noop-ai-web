"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  IconTicket,
  IconClock,
  IconProgress,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconAlertCircle,
  IconSparkles
} from "@tabler/icons-react"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useSupportTicketsAnalyticsData } from "@/lib/hooks/useSupportTicketsAnalyticsData"
import { DashboardRange } from "@/models/dashboard"
import React, { useState } from "react"

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Total Tickets": IconTicket,
  "Active Tickets": IconTicket,
  "In Progress": IconProgress,
  "Avg. Ticket Response Time": IconClock
}

const strokeColorMap: Record<string, string> = {
  "Total Tickets": "var(--chart-stat-green)",
  "Active Tickets": "var(--chart-stat-orange)",
  "In Progress": "var(--chart-stat-green)",
  "Avg. Ticket Response Time": "var(--chart-stat-purple)"
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
    value: {
      label: "value",
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
    return (
      lowerDesc.includes("slower") ||
      lowerDesc.includes("keep") ||
      lowerDesc.includes("under")
    )
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
                      stroke="var(--color-value)"
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
                !label.includes("Avg.") && (
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
                  label.includes("Avg.") ? { color: "#EF4444" } : undefined
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

export default function SupportTicketTab() {
  const { dateRange, setDateRange } = useDashboardFilters()
  const projectId = useProjectCode() ?? 0
  const { data, isLoading } = useSupportTicketsAnalyticsData(projectId, {
    range: dateRange
  })

  const [visibleCategories, setVisibleCategories] = useState(4)

  const getIcon = (label: string) => iconMap[label] || IconTicket

  const handleLoadMore = () => {
    setVisibleCategories(prev =>
      prev + 4 >= (data?.ticketCategoryBreakdown.length ?? 0)
        ? (data?.ticketCategoryBreakdown.length ?? 0)
        : prev + 4
    )
  }

  const allowedMetrics = [
    "Total Tickets",
    "Active Tickets",
    "In Progress",
    "Avg. Ticket Response Time"
  ]

  return (
    <div className="space-y-6">
      {/* Title and Date Range Picker */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">
              Support & Tickets
            </h2>
            <p className="text-muted-foreground text-sm">
              Track support trends, uncover recurring issues, and see how
              automation + user sentiment reduce ticket load.
            </p>
          </div>
          <DateRangeDropdown
            value={dateRange as DashboardRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Metric Cards (2x2 on left) and Smart Alerts (on right) */}
      <div className="grid gap-5 lg:grid-cols-[1fr_650px]">
        {/* Left: Metric Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isLoading || !data ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <StatCard
                  key={i}
                  label=""
                  value=""
                  icon={IconTicket}
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

        {/* Right: Smart Alerts */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <IconAlertCircle size={18} className="text-orange-500" />
            <CardTitle className="text-base font-semibold">
              Smart Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="shine h-20 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="relative space-y-3 overflow-clip rounded-lg">
                <h2 className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold text-zinc-600">
                  Coming soon
                </h2>
                <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60"></span>
                {/* Mock Alert Cards */}
                <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm leading-tight font-semibold">
                      Negative sentiment spike in Billing
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                      Critical Alert
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Immediate review needed — unresolved billing issues may
                    impact customer trust.
                  </p>
                </div>
                <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm leading-tight font-semibold">
                      Refund-related tickets rising
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                      High Priority
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Consider updating refund policy or bot responses to reduce
                    repeat queries.
                  </p>
                </div>
                <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm leading-tight font-semibold">
                      Users confused about coupon codes.
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-yellow-500 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                      AI Flagged
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Add a clear "How to use coupons" guide in chatbot or FAQ to
                    reduce confusion.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Category Breakdown Table & Smart Highlights */}
      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        {/* Ticket Category Breakdown Table */}
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-semibold">
                Ticket Category Breakdown
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="shine h-80 w-full rounded-md" />
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1.5fr_1.2fr] gap-4 border-b pb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  <div>Category</div>
                  <div className="text-center">Ticket Count</div>
                  <div className="text-center">Avg. Resolution Time</div>
                  <div className="text-center">Negative Sentiment</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {data?.ticketCategoryBreakdown
                    .slice(0, visibleCategories)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[2fr_1fr_1.5fr_1.2fr] items-center gap-4 rounded-lg border bg-white/50 p-3 transition-all hover:bg-white/80 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
                      >
                        <div className="font-medium">{category.category}</div>
                        <div className="text-center font-semibold">
                          {category.ticketCount}
                        </div>
                        <div className="text-muted-foreground text-center text-sm">
                          {category.avgResolutionTime}
                        </div>
                        <div className="flex justify-center">
                          <div
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              category.negativeSentiment >= 70
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : category.negativeSentiment >= 50
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {category.negativeSentiment}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Load More Button */}
                {data &&
                  visibleCategories < data.ticketCategoryBreakdown.length && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={handleLoadMore}
                        className="text-primary hover:text-primary/80 text-sm font-medium underline transition-colors"
                      >
                        Load more
                      </button>
                    </div>
                  )}
              </div>
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
                <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60"></span>
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
