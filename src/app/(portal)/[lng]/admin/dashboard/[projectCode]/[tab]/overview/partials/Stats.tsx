"use client"

import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconInfoCircle
} from "@tabler/icons-react"
import { Line, LineChart } from "recharts"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Dashboard2Stats, dummyStats, useDashboard2Stats } from "../data/data"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { DashboardRange } from "@/models/dashboard"

interface StatsProps {
  range: string
}

function getSinceLabel(range: string) {
  switch (range) {
    case DashboardRange.WEEK:
      return "Since last week"
    case DashboardRange.MONTH:
      return "Since last month"
    case DashboardRange.QUARTER:
      return "Since last 3 months"
    case DashboardRange.YEAR:
      return "Since last year"
    default:
      return ""
  }
}
export default function Stats({ range }: StatsProps) {
  const projectId = useProjectCode() ?? 0

  const {
    data: dashboard2Stats,
    isLoading,
    error
  } = useDashboard2Stats(projectId, { range })

  if (!projectId) return <div>No project selected.</div>
  if (isLoading) {
    return (
      <>
        {dummyStats.map((stats, i) => (
          <StatsCard
            key={i}
            {...stats}
            label="Loading..."
            stats={0}
            percentage={0}
            description="Loading..."
          />
        ))}
      </>
    )
  }
  if (error) return <div>Error loading stats</div>
  if (!dashboard2Stats) return null
  return (
    <>
      {dashboard2Stats.map(stats => (
        <StatsCard key={stats.label} {...stats} range={range} />
      ))}
    </>
  )
}

function StatsCard({
  label,
  description,
  stats,
  type,
  percentage,
  chartData,
  strokeColor,
  icon: Icon,
  range
}: Dashboard2Stats) {
  const chartConfig = {
    day: {
      label: "day",
      color: strokeColor
    }
  } satisfies ChartConfig

  return (
    <Card className="col-span-3 h-full lg:col-span-2 xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 truncate text-sm font-medium">
          <Icon size={16} />
          {label}
        </CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <IconInfoCircle className="text-muted-foreground scale-90 stroke-[1.25]" />
              <span className="sr-only">More Info</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex h-[calc(100%_-_48px)] flex-col justify-between py-4">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="text-3xl font-bold">{stats.toLocaleString()}</div>
            <ChartContainer className="w-[70px]" config={chartConfig}>
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
          </div>
          <p className="text-muted-foreground text-xs">
            {getSinceLabel(range)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="text-sm font-semibold">Comparison</div>
          <div
            className={cn("flex items-center gap-1", {
              "text-emerald-500 dark:text-emerald-400": type === "up",
              "text-red-500 dark:text-red-400": type === "down"
            })}
          >
            <p className={"text-[13px] leading-none font-medium"}>
              {percentage.toLocaleString()}%
            </p>
            {type === "up" ? (
              <IconCaretUpFilled size={18} />
            ) : (
              <IconCaretDownFilled />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
