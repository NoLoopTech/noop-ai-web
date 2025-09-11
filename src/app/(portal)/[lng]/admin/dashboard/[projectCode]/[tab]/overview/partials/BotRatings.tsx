"use client"

import { Line, LineChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Activity } from "lucide-react"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useOverviewStatsData } from "@/lib/hooks/useOverviewStatsData"
import { useMemo } from "react"

export default function BotRatings() {
  const chartConfig = {
    score: {
      label: "Score",
      color: "var(--primary)"
    }
  } satisfies ChartConfig

  const { dateRange: range } = useDashboardFilters()
  const projectId = useProjectCode() ?? 0

  const { data, isLoading } = useOverviewStatsData(projectId, { range })

  const statsData = useMemo(() => data ?? [], [data])

  const botRatingsStat = statsData.find(stat => stat.label === "Bot Ratings")

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="flex w-full items-center justify-between text-sm font-normal">
          {isLoading ? (
            <div className="shine h-3 w-3/4 rounded-md" />
          ) : (
            <p>Bot Ratings</p>
          )}

          {isLoading ? (
            <div className="shine h-3 w-5 rounded-md" />
          ) : (
            <Activity size={14} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_52px)] pb-0">
        {isLoading ? (
          <div className="shine h-8 w-20 rounded-md" />
        ) : (
          <div className="text-2xl font-bold">{botRatingsStat?.stats}</div>
        )}

        {isLoading ? (
          <div className="shine mt-3 h-20 w-full rounded-md" />
        ) : (
          <ChartContainer config={chartConfig} className="h-24 w-full">
            <LineChart
              data={botRatingsStat?.chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 10
              }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="score"
                stroke="var(--foreground)"
                activeDot={{
                  r: 6
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
