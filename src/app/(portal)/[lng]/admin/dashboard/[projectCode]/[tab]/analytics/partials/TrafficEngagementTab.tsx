"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { DashboardRange } from "@/models/dashboard"
import { CountryTrafficMap } from "@/components/charts/CountryTrafficMap"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconClock,
  IconMessages,
  IconUsers
} from "@tabler/icons-react"
import ReactCountryFlag from "react-country-flag"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { format, parseISO } from "date-fns"
import { SmartHighlightsCard, SmartHighlightsData } from "./SmartHighlightsCard"
import { getCountryName } from "@/utils/getCountryName"
import { TrafficAndEngagement } from "@/models/traffic-engagement-analytics"

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Total Website Visitors": IconUsers,
  "Bot Interactions": IconMessages,
  "Peak Visit Times": IconClock,
  "Repeat Visitors in Chat": IconUsers
}

const strokeColorMap: Record<string, string> = {
  "Total Website Visitors": "var(--chart-stat-green)",
  "Bot Interactions": "var(--chart-stat-blue)",
  "Peak Visit Times": "var(--chart-stat-orange)",
  "Repeat Visitors in Chat": "var(--chart-stat-purple)"
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
          {label === "Repeat Visitors in Chat" && !isLoading && (
            <p className="text-muted-foreground text-xs">
              users came back again
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

interface TrafficEngagementTabProps {
  data?: TrafficAndEngagement
  isLoading?: boolean
  smartHighlightsData?: SmartHighlightsData | null
  isLoadingHighlights?: boolean
  isErrorHighlights?: boolean
}

export default function TrafficEngagementTab({
  data,
  isLoading = false,
  smartHighlightsData,
  isLoadingHighlights,
  isErrorHighlights
}: TrafficEngagementTabProps) {
  const { dateRange, setDateRange } = useDashboardFilters()

  // Determine number of days from date range
  const days = Number(dateRange.replace(/\D/g, ""))

  // Transform traffic trend data for the chart with proper labels
  const trafficData = useMemo(() => {
    if (!data?.trafficTrend?.data) return []

    return data.trafficTrend.data.map(item => {
      let label = item.week

      try {
        // Parse the date from the backend (e.g., "2025-10-30")
        const date = parseISO(item.week)

        // For 7 days or less, show date format like "Oct 30"
        if (days <= 7) {
          label = format(date, "MMM d")
        }
        // For 30 or 90 days, show week format
        else if (days === 30 || days === 90) {
          label = format(date, "MMM d")
        }
        // For 365 days, show months
        else if (days === 365) {
          label = format(date, "MMM")
        }
      } catch (_error) {
        // If parsing fails, use the original value
        label = item.week
      }

      return {
        day: label,
        new: item.newVisitors,
        returning: item.returningVisitors
      }
    })
  }, [data?.trafficTrend?.data, days])

  const stats = useMemo(() => {
    return data?.keyMetrics || []
  }, [data?.keyMetrics])

  // Transform top countries data with ranking
  const topCountries = useMemo(() => {
    if (!data?.topCountries) return []
    return data.topCountries.map((country, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      name: getCountryName(country.countryCode),
      percent: `${Number(country.percentage || 0).toFixed(2)}%`,
      code: country.countryCode,
      growth: `${Math.abs(Number(country.changePercentage || 0))}%`,
      trend: country.trend
    }))
  }, [data?.topCountries])

  // Transform country data for the map
  const mapData = useMemo(() => {
    if (!data?.topCountries) return []
    return data.topCountries.map(country => ({
      countryCode: country.countryCode,
      value: Number(country.percentage),
      changePercentage: Number(country.changePercentage || 0),
      trend: country.trend as "up" | "down"
    }))
  }, [data?.topCountries])

  const getIcon = (label: string) => iconMap[label] || IconUsers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Traffic & Engagement
          </h2>
          <p className="text-muted-foreground text-sm">
            Understand how visitors interact with your website and chatbot to
            optimize customer engagement.
          </p>
        </div>
        <DateRangeDropdown
          value={dateRange as DashboardRange}
          onChange={setDateRange}
        />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          stats.map(metric => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.description}
              icon={getIcon(metric.label)}
              chartData={metric.chartData}
              percentage={metric.percentage}
              trend={metric.trend}
              isLoading={false}
            />
          ))
        )}
      </div>

      {/* Main chart + Right highlights */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Traffic Trend (replace existing Traffic Trend Card with this) */}
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Traffic Trend
                </CardTitle>
                <div className="text-muted-foreground text-sm">
                  Trending {data?.trafficTrend?.trendDirection || "up"} by{" "}
                  <span
                    className={`font-medium ${
                      data?.trafficTrend?.trendDirection === "up"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {data?.trafficTrend?.trendPercentage?.toFixed(1) || "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="shine h-80 w-full rounded-md" />
            ) : (
              <div className="flex h-80 w-full gap-4">
                {/* Chart area (left) */}
                <div className="flex-1 pr-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trafficData}
                      margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        domain={[0, "auto"]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tickFormatter={v =>
                          Number.isFinite(v) && v >= 1000
                            ? `${Math.round(v / 1000)}k`
                            : v
                        }
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 8 }}
                        formatter={(value: string | number, name: string) => [
                          value,
                          name === "returning" ? "Return users" : "New users"
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="returning"
                        name="Return users"
                        stroke="#16A34A"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="new"
                        name="New users"
                        stroke="#F97316"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Embedded Overview panel (right inside same card) */}
                <div className="w-72 flex-shrink-0 border-l border-gray-100 pl-4">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      {/* Last month change */}
                      <div>
                        <div className="text-muted-foreground text-sm">
                          Last month change
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {(data?.trafficTrend?.lastMonthChange || 0) >= 0 ? (
                            <IconCaretUpFilled
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <IconCaretDownFilled
                              size={14}
                              className="text-rose-500"
                            />
                          )}
                          <span
                            className={`text-lg font-bold ${
                              (data?.trafficTrend?.lastMonthChange || 0) >= 0
                                ? "text-emerald-500"
                                : "text-rose-500"
                            }`}
                          >
                            {Math.abs(
                              data?.trafficTrend?.lastMonthChange || 0
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Avg Visit Duration */}
                      <div className="mt-6">
                        <div className="text-muted-foreground text-sm">
                          Avg Visit Duration
                        </div>
                        <div className="mt-1 text-lg font-bold">
                          {data?.trafficTrend?.avgVisitDuration || "00:00:00"}
                        </div>
                      </div>

                      {/* New vs Returning Visitors */}
                      <div className="mt-6">
                        <div className="text-muted-foreground text-sm">
                          New vs Returning Visitors
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          {/* Return users */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ background: "#16A34A" }}
                              />
                              <span className="text-sm">Return users</span>
                            </div>
                            <div
                              className={`text-sm ${
                                (data?.trafficTrend?.newVsReturning
                                  ?.returnUsers || 0) >= 0
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {(data?.trafficTrend?.newVsReturning
                                ?.returnUsers || 0) >= 0
                                ? "▲"
                                : "▼"}{" "}
                              {Math.abs(
                                data?.trafficTrend?.newVsReturning
                                  ?.returnUsers || 0
                              )}
                              %
                            </div>
                          </div>

                          {/* New users */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ background: "#F97316" }}
                              />
                              <span className="text-sm">New users</span>
                            </div>
                            <div
                              className={`text-sm ${
                                (data?.trafficTrend?.newVsReturning?.newUsers ||
                                  0) >= 0
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {(data?.trafficTrend?.newVsReturning?.newUsers ||
                                0) >= 0
                                ? "▲"
                                : "▼"}{" "}
                              {Math.abs(
                                data?.trafficTrend?.newVsReturning?.newUsers ||
                                  0
                              )}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Highlights */}
        <SmartHighlightsCard
          data={smartHighlightsData}
          isLoading={isLoadingHighlights}
          isError={isErrorHighlights}
        />
      </div>

      {/* Bottom row: Top countries + Geo map */}
      <div className="flex w-full space-x-3.5">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="shine h-16 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {topCountries.slice(0, 5).map(c => (
                    <div
                      key={c.rank}
                      className="flex items-center space-x-4 border-b border-zinc-400/20 pb-2.5"
                    >
                      <p className="text-muted-foreground">{c.rank}</p>

                      <div className="flex w-full min-w-52 items-center space-x-2.5 rounded-lg bg-transparent">
                        <div className="min-h-8 min-w-8 overflow-hidden rounded-full">
                          <ReactCountryFlag
                            svg
                            countryCode={c.code ?? ""}
                            style={{
                              width: "100%",
                              height: "100%"
                            }}
                            className="min-h-8 max-w-8 object-cover"
                            title={c.name}
                            aria-label={`${c.name} flag`}
                          />
                        </div>

                        <div className="flex w-full flex-col items-start">
                          <p className="max-w-[80%] min-w-full text-sm font-normal wrap-anywhere text-zinc-600 dark:text-zinc-500">
                            {c.name}
                          </p>

                          <div className="flex w-full items-center justify-between">
                            <div className="text-base text-zinc-900 dark:text-zinc-400">
                              {c.percent}
                            </div>

                            <div
                              className="flex items-end space-x-1 text-xs"
                              style={{
                                color: c.trend === "up" ? "#34C759" : "#EF4444"
                              }}
                            >
                              {c.trend === "up" ? (
                                <IconCaretUpFilled
                                  size={14}
                                  className="text-inherit"
                                />
                              ) : (
                                <IconCaretDownFilled
                                  size={14}
                                  className="text-inherit"
                                />
                              )}

                              <p className="text-inherit">{c.growth}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* See all countries button - only show if more than 5 */}
                {topCountries.length > 5 && (
                  <div className="flex justify-center pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-2 rounded-sm border-2 border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-all hover:opacity-90 dark:text-white">
                          <span>See all countries</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>All Countries</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 py-4">
                          {topCountries.map(c => (
                            <div
                              key={c.rank}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-muted-foreground w-8">
                                  {c.rank}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div
                                    className="flex items-center justify-center overflow-hidden rounded-full"
                                    style={{
                                      width: "2rem",
                                      height: "1.5rem",
                                      backgroundColor: "#f3f3f3"
                                    }}
                                  >
                                    <ReactCountryFlag
                                      svg
                                      countryCode={c.code ?? ""}
                                      style={{
                                        width: "100%",
                                        height: "auto"
                                      }}
                                      title={c.name}
                                      aria-label={`${c.name} flag`}
                                    />
                                  </div>

                                  <div>
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-muted-foreground text-md">
                                      {c.percent}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold">
                                <span
                                  className="flex items-center gap-0.5"
                                  style={{
                                    color:
                                      c.trend === "up" ? "#34C759" : "#EF4444"
                                  }}
                                >
                                  {c.trend === "up" ? (
                                    <IconCaretUpFilled size={14} />
                                  ) : (
                                    <IconCaretDownFilled size={14} />
                                  )}
                                  {c.growth}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Bot Traffic By Country */}
        <Card className="3xl:min-h-[600px] min-h-[450px] max-w-[calc(100%-314px)] flex-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Bot Traffic by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
            <div className="h-auto w-full">
              {isLoading ? (
                <div className="shine h-96 w-full rounded-md" />
              ) : (
                <div className="h-full w-full overflow-hidden rounded-md">
                  <CountryTrafficMap data={mapData} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
