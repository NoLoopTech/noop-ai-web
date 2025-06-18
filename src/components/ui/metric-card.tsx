"use client"

import { Activity, ArrowUp, BarChart, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  timeSpan: string
  trend: "up" | "down" | "neutral"
  icon?: "chart" | "message" | "activity" | "mail"
}

export function MetricCard({
  title,
  value,
  change,
  timeSpan,
  trend,
  icon
}: MetricCardProps): JSX.Element {
  const renderIcon = (): JSX.Element => {
    switch (icon) {
      case "chart":
        return <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      case "message":
        return (
          <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )
      case "activity":
        return <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      case "mail":
        return <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      default:
        return <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    }
  }

  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-400"
      : trend === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </span>
          {renderIcon()}
        </div>
        <div className="mt-4">
          <span className="text-3xl font-semibold">{value}</span>
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className={cn("flex items-center gap-1", trendColor)}>
              {change}
              <ArrowUp
                className={cn("h-3 w-3", trend === "down" && "rotate-180")}
              />
            </span>
            &nbsp;{timeSpan}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
