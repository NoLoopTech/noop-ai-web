"use client"

import { useMemo } from "react"
import StatsCard from "./StatCard"
import { useOverviewStatsData } from "@/lib/hooks/useOverviewStatsData"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"

interface StatsProps {
  allowedLabels: string[]
  isComingSoon?: boolean
  showChart?: boolean
  showBadge?: boolean
  isPercentage?: boolean
}

export default function Stats({
  allowedLabels,
  showChart,
  showBadge,
  isPercentage
}: StatsProps) {
  const { dateRange: range } = useDashboardFilters()

  const projectCode = useProjectCode()
  const projectId = typeof projectCode === "number" ? projectCode : 0
  const { data, isLoading } = useOverviewStatsData(projectId, { range })

  const statsData = useMemo(() => data ?? [], [data])

  // const allowedLabels = [
  //   "Total Conversations",
  //   "Avg Messages per Chat",
  //   "Messages Sent"
  // ]

  return (
    <>
      {allowedLabels.map(label => {
        const stat = statsData.find(s => s.label === label)
        return (
          <StatsCard
            key={label}
            label={label}
            stats={stat?.stats ?? 0}
            type={stat?.type ?? "up"}
            percentage={stat?.percentage ?? 0}
            chartData={stat?.chartData ?? []}
            strokeColor={stat?.strokeColor ?? "#ccc"}
            icon={stat?.icon ?? null}
            isLoading={isLoading || !stat}
            range={range}
            showChart={showChart}
            showBadge={showBadge}
            isPercentage={isPercentage}
          />
        )
      })}
    </>
  )
}
