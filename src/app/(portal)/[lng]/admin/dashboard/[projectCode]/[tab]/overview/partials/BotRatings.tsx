"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/ui/star-rating"
import { Activity } from "lucide-react"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useOverviewStatsData } from "@/lib/hooks/useOverviewStatsData"
import { useMemo } from "react"

export default function BotRatings() {
  const { dateRange: range } = useDashboardFilters()

  const projectCode = useProjectCode()
  const projectId = typeof projectCode === "number" ? projectCode : 0
  const { data, isLoading } = useOverviewStatsData(projectId, {
    range,
    enabled: typeof projectCode === "number"
  })

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
          <div className="mt-4">
            <StarRating rating={botRatingsStat?.stars ?? 0} size={24} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
