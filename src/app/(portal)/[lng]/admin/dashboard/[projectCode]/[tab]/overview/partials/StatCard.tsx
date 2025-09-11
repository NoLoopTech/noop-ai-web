import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import { Line, LineChart } from "recharts"
import { cn } from "@/lib/utils"
import { OverviewStatData } from "@/models/dashboard"
import { getRangeLabel, getScoreVariant } from "@/utils"
import ChatScoreBadge from "@/components/ChatScoreBadge"

interface StatCardProps extends OverviewStatData {
  isLoading?: boolean
  showChart?: boolean
  showBadge?: boolean
  isPercentage?: boolean
}

export default function StatsCard({
  label,
  stats,
  type,
  percentage,
  chartData,
  strokeColor,
  icon: Icon,
  range,
  isLoading,
  showChart = true,
  showBadge = false,
  isPercentage = false
}: StatCardProps) {
  const chartConfig = {
    month: {
      label: "month",
      color: strokeColor
    }
  } satisfies ChartConfig

  return (
    <Card className="col-span-3 h-full lg:col-span-2 xl:col-span-2">
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
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {isLoading ? (
              <div className="shine h-14 w-20 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">
                {Math.round(stats).toLocaleString()}
                {isPercentage ? "%" : ""}
              </div>
            )}

            {showChart &&
              (isLoading ? (
                <div className="shine h-14 w-20 rounded-md" />
              ) : (
                <ChartContainer className="w-20" config={chartConfig}>
                  <LineChart accessibilityLayer data={chartData}>
                    {/* <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  /> */}
                    {/* INFO: XAxis is not used here but keeping for testing purposes */}
                    <Line
                      dataKey="value"
                      type="linear"
                      stroke="var(--color-month)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              ))}
          </div>

          {isLoading ? (
            <div className="shine mt-2 h-3 w-1/2 rounded-md" />
          ) : (
            <p className="text-muted-foreground text-xs">
              {getRangeLabel(range)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5">
          {isLoading ? (
            <div className="shine mt-5 mb-2 h-3 w-24 rounded-md" />
          ) : showBadge ? (
            <div className="text-sm font-semibold"></div>
          ) : (
            <div className="text-sm font-semibold">Comparison</div>
          )}

          {isLoading ? (
            <div className="shine mt-5 mb-2 h-3 w-12 rounded-md" />
          ) : showBadge ? (
            <div className={`text-sm font-semibold`}>
              <ChatScoreBadge
                variant={getScoreVariant(stats / 100)}
                value={getScoreVariant(stats / 100)}
              />
            </div>
          ) : (
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
                <IconCaretUpFilled size={16} />
              ) : (
                <IconCaretDownFilled size={16} />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
