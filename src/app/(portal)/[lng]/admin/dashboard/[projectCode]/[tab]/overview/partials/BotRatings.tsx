// "use client"

// import { Line, LineChart } from "recharts"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChartConfig, ChartContainer } from "@/components/ui/chart"
// import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
// import { useProjectCode } from "@/lib/hooks/useProjectCode"
// import { Skeleton } from "@/components/ui/skeleton"
// import { DashboardRange } from "@/models/dashboard"
// import { useOverviewStatsData } from "@/lib/hooks/useOverviewStatsData"

// function getRangeLabel(range: string) {
//   switch (range) {
//     case DashboardRange.WEEK:
//       return "Since last week"
//     case DashboardRange.MONTH:
//       return "Since last month"
//     case DashboardRange.QUARTER:
//       return "Since last 3 months"
//     case DashboardRange.YEAR:
//       return "Since last year"
//     default:
//       return ""
//   }
// }

// const chartConfig = {
//   revenue: {
//     label: "Score",
//     color: "var(--primary)"
//   }
// } satisfies ChartConfig

// export default function TotalRevenue() {
//   const { dateRange: range } = useDashboardFilters()
//   const projectId = useProjectCode() ?? 0

//   const { data, isLoading, error } = useOverviewStatsData(projectId, { range })

//   const botRatingsStat = data.find(stat => stat.label === "Bot Ratings")

//   if (!projectId) return <div>No project selected.</div>
//   if (isLoading) {
//     return (
//       <Card className="h-full animate-pulse">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-normal">Bot Ratings</CardTitle>
//         </CardHeader>
//         <CardContent className="h-[calc(100%_-_52px)] pb-0">
//           <div className="text-2xl font-bold">0</div>
//           <div className="text-muted-foreground text-xs">
//             <Skeleton className="h-4 w-32" />
//           </div>
//           <ChartContainer config={chartConfig} className="h-[80px] w-full">
//             <LineChart
//               data={[]}
//               margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
//             >
//               <Line
//                 type="monotone"
//                 strokeWidth={2}
//                 dataKey="revenue"
//                 stroke="var(--color-revenue)"
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>
//     )
//   }
//   if (error) return <div>Error loading stats</div>
//   if (!botRatingsStat) return <div>No Bot Ratings data</div>

//   return (
//     <Card className="h-full">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-normal">
//           {botRatingsStat.label}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="h-[calc(100%_-_52px)] pb-0">
//         <div className="text-2xl font-bold">
//           {botRatingsStat.thumbs?.toLocaleString()}
//         </div>
//         <ChartContainer config={chartConfig} className="h-[80px] w-full">
//           <LineChart
//             data={botRatingsStat.chartData}
//             margin={{
//               top: 5,
//               right: 10,
//               left: 10,
//               bottom: 0
//             }}
//           >
//             <Line
//               type="monotone"
//               strokeWidth={2}
//               dataKey="score"
//               stroke="var(--color-foreground)"
//               activeDot={{
//                 r: 6
//               }}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

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
