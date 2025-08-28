"use client"

import { Line, LineChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useDashboard2Stats } from "../data/data"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { Skeleton } from "@/components/ui/skeleton"

// const data = [
//   {
//     revenue: 10400,
//     subscription: 240
//   },
//   {
//     revenue: 14405,
//     subscription: 300
//   },
//   {
//     revenue: 9400,
//     subscription: 200
//   },
//   {
//     revenue: 8200,
//     subscription: 278
//   },
//   {
//     revenue: 7000,
//     subscription: 189
//   },
//   {
//     revenue: 9600,
//     subscription: 239
//   },
//   {
//     revenue: 11244,
//     subscription: 278
//   },
//   {
//     revenue: 26475,
//     subscription: 189
//   }
// ]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)"
  },
  subscription: {
    label: "Subscriptions",
    color: "var(--primary)"
  }
} satisfies ChartConfig

export default function TotalRevenue() {
  const { dateRange: range } = useDashboardFilters()
  const projectId = useProjectCode() ?? 0

  const {
    data: dashboard2Stats,
    isLoading,
    error
  } = useDashboard2Stats(projectId, { range })

  const botRatingsStat = dashboard2Stats.find(
    stat => stat.label === "Bot Ratings"
  )

  if (!projectId) return <div>No project selected.</div>
  if (isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Bot Ratings</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%_-_52px)] pb-0">
          <div className="text-2xl font-bold">0</div>
          <div className="text-muted-foreground text-xs">
            <Skeleton className="h-4 w-32" />
          </div>
          <ChartContainer config={chartConfig} className="h-[80px] w-full">
            <LineChart
              data={[]}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }
  if (error) return <div>Error loading stats</div>
  if (!botRatingsStat) return <div>No Bot Ratings data</div>

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">
          {botRatingsStat.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_52px)] pb-0">
        <div className="text-2xl font-bold">
          {botRatingsStat.thumbs?.toLocaleString()}
        </div>
        <p className="text-muted-foreground text-xs">
          {botRatingsStat.percentage != null
            ? `+${botRatingsStat.percentage}%`
            : ""}{" "}
          {range === "7"
            ? "since last week"
            : range === "30"
              ? "since last month"
              : range === "90"
                ? "since last 3 months"
                : range === "365"
                  ? "since last year"
                  : ""}
        </p>
        <ChartContainer config={chartConfig} className="h-[80px] w-full">
          <LineChart
            data={botRatingsStat.chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0
            }}
          >
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="revenue"
              stroke="var(--color-revenue)"
              activeDot={{
                r: 6
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
