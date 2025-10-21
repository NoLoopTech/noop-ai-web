"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { DashboardRange } from "@/models/dashboard"
import Image from "next/image"
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
  IconUsers,
  IconSparkles
} from "@tabler/icons-react"
import ReactCountryFlag from "react-country-flag"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Total Website Visitors": IconUsers,
  "Bot conversations": IconMessages,
  "Peak Visit Times": IconClock,
  "Repeat Visitors in Chat": IconUsers
}

const strokeColorMap: Record<string, string> = {
  "Total Website Visitors": "var(--chart-stat-green)",
  "Bot conversations": "var(--chart-stat-blue)",
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
        </div>
      </CardContent>
    </Card>
  )
})

export default function TrackEngagementTab() {
  const { dateRange, setDateRange } = useDashboardFilters()

  // Loading placeholder flag
  const isLoading = false

  // Dummy data for design-only charts (two series: new + returning users)
  const trafficData = useMemo(
    () => [
      { day: "Week 1", new: 3800, returning: 5200 },
      { day: "Week 2", new: 4600, returning: 7600 },
      { day: "Week 3", new: 3200, returning: 1800 },
      { day: "Week 4", new: 5000, returning: 4800 }
    ],
    []
  )

  const stats = useMemo(
    () => [
      {
        label: "Total Website Visitors",
        value: 1200,
        trend: "up",
        percentage: 222,
        chartData: [
          { day: "2025-10-15", value: 20 },
          { day: "2025-10-16", value: 15 },
          { day: "2025-10-17", value: 25 },
          { day: "2025-10-18", value: 25 },
          { day: "2025-10-19", value: 25 },
          { day: "2025-10-20", value: 25 },
          { day: "2025-10-21", value: 25 }
        ]
      },
      {
        label: "Bot Conversations",
        value: 650,
        trend: "up",
        percentage: 222,
        chartData: [
          { day: "2025-10-15", value: 20 },
          { day: "2025-10-16", value: 15 },
          { day: "2025-10-17", value: 25 },
          { day: "2025-10-18", value: 25 },
          { day: "2025-10-19", value: 25 },
          { day: "2025-10-20", value: 25 },
          { day: "2025-10-21", value: 25 }
        ]
      },
      {
        label: "Peak Visit Times",
        value: "7-10 PM",
        trend: "up",
        percentage: 222,
        chartData: [
          { day: "2025-10-15", value: 2 },
          { day: "2025-10-16", value: 4 },
          { day: "2025-10-17", value: 3 },
          { day: "2025-10-18", value: 5 }
        ]
      },
      {
        label: "Repeat Visitors in Chat",
        value: "35%",
        description: "users came back again",
        trend: "down"
      }
    ],
    []
  )

  const topCountries = useMemo(
    () => [
      {
        rank: "01",
        name: "United States of America",
        percent: "16.89%",
        code: "US"
      },
      { rank: "02", name: "United Kingdom", percent: "10.89%", code: "GB" },
      { rank: "03", name: "Germany", percent: "6.89%", code: "DE" },
      { rank: "04", name: "India", percent: "2.89%", code: "IN" }
    ],
    []
  )

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
        {stats.map(metric => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            icon={getIcon(metric.label)}
            chartData={metric.chartData}
            percentage={metric.percentage}
            trend={"up"}
            isLoading={false}
          />
        ))}
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
                  Trending up by
                  <span className="font-medium text-emerald-600">5.2%</span>
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
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={v =>
                          Number.isFinite(v) ? `${Math.round(v / 1000)}k` : v
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
                          <IconCaretDownFilled
                            size={14}
                            className="text-rose-500"
                          />
                          <span className="text-lg font-bold text-rose-500">
                            4.15%
                          </span>
                        </div>
                      </div>

                      {/* Avg Visit Duration */}
                      <div className="mt-6">
                        <div className="text-muted-foreground text-sm">
                          Avg Visit Duration
                        </div>
                        <div className="mt-1 text-lg font-bold">00:02:01</div>
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
                            <div className="text-sm text-emerald-500">
                              ▲ 12%
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
                            <div className="text-sm text-emerald-500">
                              ▲ 12%
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
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />{" "}
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
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />{" "}
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
                    <span>Learn more</span> <IconSparkles size={14} />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Top countries + Geo map */}
      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map(c => (
                <div key={c.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">{c.rank}</div>
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
                        <div className="text-muted-foreground text-xs">
                          {c.percent}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-emerald-500">▲ 12%</div>
                </div>
              ))}
            </div>
            {/* See all countries button */}
            <div className="flex justify-center pt-2">
              <button className="flex items-center gap-2 rounded-sm border-2 border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-all hover:opacity-90 dark:text-white">
                <span>See all countries</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Bot Traffic By Country */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Bot Traffic by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <div className="relative h-64 w-full">
              <h2 className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold text-zinc-600">
                Coming soon
              </h2>
              <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60"></span>

              <Image
                src="/assets/map-placeholder.svg"
                alt="World map placeholder"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
