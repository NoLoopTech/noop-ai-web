"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart"
import { CustomChartLegend } from "@/components/CustomChartLegend"
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useOverviewStatsData } from "@/lib/hooks/useOverviewStatsData"
import { useMemo } from "react"
import { format, parseISO } from "date-fns"
import { OverviewStatData } from "@/models/dashboard"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

type ChartDataItem = {
  day?: string
  value?: number
  score?: number
}

const chartConfig = {
  bot: {
    label: "Bot",
    color: "var(--chart-usage-green)"
  },
  user: {
    label: "User",
    color: "var(--chart-usage-orange)"
  }
} satisfies ChartConfig

const valueToLabelMap = {
  bot: "Bot Messages",
  user: "User Messages"
}

export default function UsageGraph() {
  const { dateRange: range } = useDashboardFilters()
  const projectCode = useProjectCode()
  const projectId = typeof projectCode === "number" ? projectCode : 0

  const { data: statsData, isLoading } = useOverviewStatsData(projectId, {
    range,
    enabled: typeof projectCode === "number"
  })

  const { data, botStat } = useMemo<{
    data: Array<{ day: string; bot: number; user: number; date: Date }>
    botStat: OverviewStatData | null
  }>(() => {
    if (!statsData) return { data: [], botStat: null }

    const botStat = statsData.find(s => s.label === "Messages Sent")
    const userStat = statsData.find(s => s.label === "User Messages")

    if (!botStat || !userStat) return { data: [], botStat: null }

    const dayMap = new Map<string, { bot: number; user: number; date: Date }>()

    // INFO: Process bot data
    botStat.chartData.forEach((item: ChartDataItem) => {
      if (item.day && item.value !== undefined) {
        const date = new Date(item.day)
        const formattedDay = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
        if (dayMap.has(formattedDay)) {
          dayMap.get(formattedDay)!.bot = item.value
        } else {
          dayMap.set(formattedDay, { bot: item.value, user: 0, date })
        }
      }
    })

    // INFO: Process user data
    userStat.chartData.forEach((item: ChartDataItem) => {
      if (item.day && item.value !== undefined) {
        const date = new Date(item.day)
        const formattedDay = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
        if (dayMap.has(formattedDay)) {
          dayMap.get(formattedDay)!.user = item.value
        } else {
          dayMap.set(formattedDay, { bot: 0, user: item.value, date })
        }
      }
    })

    // INFO: Convert to array and sort by date
    const data = Array.from(dayMap.entries())
      .map(([day, values]) => ({ day, ...values }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return { data, botStat }
  }, [statsData])

  const days = Number(range.replace(/\D/g, ""))

  // INFO: Determine aggregation type based on days
  let aggregation = "daily"
  if (days <= 7) {
    aggregation = "daily"
  } else if (days === 30 || days === 90) {
    aggregation = "weekly"
  } else if (days === 365) {
    aggregation = "monthly"
  } else {
    aggregation = "monthly" // INFO: Default for other ranges
  }

  // INFO: Aggregate daily data to weekly
  function aggregateByWeek(
    data: Array<{ date: Date; bot: number; user: number }>
  ) {
    const weekly: Record<
      string,
      { bot: number; user: number; month: string; week: number; year: string }
    > = {}

    data.forEach(item => {
      const month = format(item.date, "MMM")
      const year = format(item.date, "yyyy")
      const dayOfMonth = item.date.getDate()
      const week = Math.ceil(dayOfMonth / 7)
      const key = `${year}-${month}-${week}`
      if (!weekly[key]) {
        weekly[key] = { bot: 0, user: 0, month, week, year }
      }
      weekly[key].bot += item.bot
      weekly[key].user += item.user
    })

    // INFO: Convert to array for chart
    const weeklyArray = Object.entries(weekly).map(
      ([_, { bot, user, month, week, year }]) => ({
        day: month,
        bot,
        user,
        tooltipDate: `${month} Week ${week}, ${year}`
      })
    )

    return weeklyArray
  }

  // INFO: Aggregate daily data to monthly
  function aggregateByMonth(
    data: Array<{ date: Date; bot: number; user: number }>
  ) {
    const monthly: Record<string, { bot: number; user: number }> = {}

    data.forEach(item => {
      const monthKey = format(item.date, "yyyy-MM")
      if (!monthly[monthKey]) {
        monthly[monthKey] = { bot: 0, user: 0 }
      }
      monthly[monthKey].bot += item.bot
      monthly[monthKey].user += item.user
    })

    // INFO: Convert to array for chart
    const monthlyArray = Object.entries(monthly).map(
      ([month, { bot, user }]) => {
        const date = parseISO(`${month}-01`)
        return {
          day: format(date, "MMM"),
          bot,
          user,
          tooltipDate: format(date, "MMM yyyy")
        }
      }
    )

    // INFO: If long range, reduce to last 12 months
    return monthlyArray.length > 12 ? monthlyArray.slice(-12) : monthlyArray
  }

  // INFO: Aggregate based on type
  let chartData
  if (aggregation === "daily") {
    chartData = data.map(item => ({
      day: format(item.date, "MMM d"),
      bot: item.bot,
      user: item.user,
      tooltipDate: format(item.date, "MMM d, yyyy")
    }))
  } else if (aggregation === "weekly") {
    chartData = aggregateByWeek(data)
  } else {
    chartData = aggregateByMonth(data)
  }

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-col space-y-0.5">
        <CardTitle className="text-base font-semibold">Usage Graph</CardTitle>
        <CardDescription>
          {isLoading ? (
            <div className="shine my-1 h-3 w-1/2 rounded-md" />
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-sm">
                Trending {botStat?.type === "up" ? "up" : "down"} by{" "}
                {botStat?.percentage.toLocaleString()}%
              </p>
              <div>
                {botStat?.type === "up" ? (
                  <IconTrendingUp size={18} />
                ) : (
                  <IconTrendingDown size={18} />
                )}
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_90px)]">
        {isLoading ? (
          <div className="shine h-full w-full rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  // angle={
                  //   aggregation === "monthly" || aggregation === "weekly"
                  //     ? -45
                  //     : 0
                  // }
                  // textAnchor={
                  //   aggregation === "monthly" || aggregation === "weekly"
                  //     ? "end"
                  //     : "middle"
                  // }

                  // INFO: Kept for reference if needed later
                  label={{
                    value:
                      aggregation === "daily"
                        ? "Daily"
                        : aggregation === "weekly"
                          ? "Weekly"
                          : "Monthly",
                    position: "insideBottom",
                    offset: -10,
                    style: { textAnchor: "middle" }
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{
                    value: "Message Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 5,
                    style: { textAnchor: "middle" }
                  }}
                />
                <Legend
                  content={
                    <CustomChartLegend
                      valueToLabel={valueToLabelMap}
                      xAxisVisible={true}
                    />
                  }
                />
                <ChartTooltip
                  cursor={true}
                  content={<CustomChartTooltip chartConfig={chartConfig} />}
                />
                <Bar
                  dataKey="bot"
                  fill="var(--chart-usage-green)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="user"
                  fill="var(--chart-usage-orange)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
