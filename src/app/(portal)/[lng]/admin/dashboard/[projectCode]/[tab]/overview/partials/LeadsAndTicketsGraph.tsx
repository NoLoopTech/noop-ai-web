"use client"

import {
  Area,
  AreaChart,
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
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

type ChartDataItem = {
  day?: string
  value?: number
  score?: number
}

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-usage-green)"
  },
  tickets: {
    label: "Tickets",
    color: "var(--chart-usage-orange)"
  }
} satisfies ChartConfig

const valueToLabelMap = {
  leads: "Leads",
  tickets: "Tickets"
}

export default function LeadsAndTicketsGraph() {
  const { dateRange: range } = useDashboardFilters()

  const projectCode = useProjectCode()
  const projectId = typeof projectCode === "number" ? projectCode : 0
  const { data: statsData, isLoading } = useOverviewStatsData(projectId, {
    range,
    enabled: typeof projectCode === "number"
  })

  const { data, combinedStat } = useMemo<{
    data: Array<{ day: string; leads: number; tickets: number; date: Date }>
    combinedStat: { type: "up" | "down"; percentage: number } | null
  }>(() => {
    if (!statsData) return { data: [], leadsStat: null, combinedStat: null }

    const leadsStat = statsData.find(s => s.label === "Leads Captured")
    const ticketsStat = statsData.find(s => s.label === "Tickets Submitted")

    if (!leadsStat || !ticketsStat)
      return { data: [], leadsStat: null, combinedStat: null }

    const dayMap = new Map<
      string,
      { leads: number; tickets: number; date: Date }
    >()

    // INFO: Process leads data
    leadsStat.chartData.forEach((item: ChartDataItem) => {
      if (item.day && item.value !== undefined) {
        const date = new Date(item.day)
        const formattedDay = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
        if (dayMap.has(formattedDay)) {
          dayMap.get(formattedDay)!.leads = item.value
        } else {
          dayMap.set(formattedDay, { leads: item.value, tickets: 0, date })
        }
      }
    })

    // INFO: Process tickets data
    ticketsStat.chartData.forEach((item: ChartDataItem) => {
      if (item.day && item.value !== undefined) {
        const date = new Date(item.day)
        const formattedDay = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
        if (dayMap.has(formattedDay)) {
          dayMap.get(formattedDay)!.tickets = item.value
        } else {
          dayMap.set(formattedDay, { leads: 0, tickets: item.value, date })
        }
      }
    })

    // INFO: Convert to array and sort by date
    const data = Array.from(dayMap.entries())
      .map(([day, values]) => ({ day, ...values }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    // INFO: Compute combined stat (average percentages, derive type)
    const leadsPercentage = leadsStat.percentage ?? 0
    const ticketsPercentage = ticketsStat.percentage ?? 0
    const combinedPercentage = (leadsPercentage + ticketsPercentage) / 2
    const combinedType: "up" | "down" = combinedPercentage >= 0 ? "up" : "down"

    const combinedStat = {
      type: combinedType,
      percentage: combinedPercentage
    }

    return { data, combinedStat }
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
    data: Array<{ date: Date; leads: number; tickets: number }>
  ) {
    const weekly: Record<
      string,
      {
        leads: number
        tickets: number
        month: string
        week: number
        year: string
      }
    > = {}

    data.forEach(item => {
      if (!item.date || isNaN(item.date.getTime())) return
      const month = format(item.date, "MMM")
      const year = format(item.date, "yyyy")
      const dayOfMonth = item.date.getDate()
      const week = Math.ceil(dayOfMonth / 7)
      const key = `${year}-${month}-${week}`
      if (!weekly[key]) {
        weekly[key] = { leads: 0, tickets: 0, month, week, year }
      }
      weekly[key].leads += item.leads
      weekly[key].tickets += item.tickets
    })

    // INFO: Convert to array for chart
    const weeklyArray = Object.entries(weekly).map(
      ([_, { leads, tickets, month, week, year }]) => ({
        day: month,
        leads,
        tickets,
        tooltipDate: `${month} Week ${week}, ${year}`
      })
    )

    return weeklyArray
  }

  // INFO: Aggregate daily data to monthly
  function aggregateByMonth(
    data: Array<{ date: Date; leads: number; tickets: number }>
  ) {
    const monthly: Record<string, { leads: number; tickets: number }> = {}

    data.forEach(item => {
      if (!item.date || isNaN(item.date.getTime())) return
      const monthKey = format(item.date, "yyyy-MM")
      if (!monthly[monthKey]) {
        monthly[monthKey] = { leads: 0, tickets: 0 }
      }
      monthly[monthKey].leads += item.leads
      monthly[monthKey].tickets += item.tickets
    })

    // INFO: Convert to array for chart
    const monthlyArray = Object.entries(monthly).map(
      ([month, { leads, tickets }]) => {
        const date = parseISO(`${month}-01`)
        return {
          day: format(date, "MMM"),
          leads,
          tickets,
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
      leads: item.leads,
      tickets: item.tickets,
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
        <CardTitle className="text-base font-semibold">
          Leads and Tickets Graph
        </CardTitle>
        <CardDescription>
          {isLoading ? (
            <div className="shine my-1 h-3 w-1/2 rounded-md" />
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-sm">
                Trending {combinedStat?.type === "up" ? "up" : "down"} by{" "}
                {combinedStat?.percentage.toLocaleString()}%
              </p>
              <div>
                {combinedStat?.type === "up" ? (
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
              <AreaChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
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
                  interval={0}
                  tickMargin={8}
                  domain={
                    aggregation === "daily"
                      ? [0, 10]
                      : aggregation === "weekly"
                        ? [0, "dataMax"]
                        : [0, "dataMax"]
                  }
                  label={{
                    value: "Count",
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

                <defs>
                  <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-usage-green)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-usage-green)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-usage-orange)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-usage-orange)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>

                <Area
                  dataKey="tickets"
                  type="natural"
                  fill="url(#fillTickets)"
                  fillOpacity={0.4}
                  stroke="var(--chart-usage-orange)"
                  stackId="a"
                  height={5}
                />
                <Area
                  dataKey="leads"
                  type="natural"
                  fill="url(#fillLeads)"
                  fillOpacity={0.4}
                  stroke="var(--chart-usage-green)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
