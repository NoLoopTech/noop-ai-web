import { DashboardRange, OverviewStatData } from "@/models/dashboard"
import { useApiQuery } from "@/query"
import {
  Icon,
  IconGift,
  IconMessage2Share,
  IconMessageCircleBolt,
  IconMessageReply,
  IconMessages,
  IconProps
} from "@tabler/icons-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

const iconMap: Record<
  string,
  ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
> = {
  "Total Conversations": IconMessages,
  "Avg Messages per Chat": IconMessage2Share,
  "Messages Sent": IconMessageReply,
  "Chat Confidence": IconMessageCircleBolt
}

const strokeColorMap: Record<string, string> = {
  "Total Conversations": "var(--chart-stat-green)",
  "Avg Messages per Chat": "var(--chart-stat-blue)",
  "Messages Sent": "var(--chart-stat-orange)"
}

function enrichDashboard2Stats(
  stats: Partial<OverviewStatData>[],
  range: string
): OverviewStatData[] {
  return stats.map(
    stat =>
      ({
        ...stat,
        icon: iconMap[stat.label ?? ""] ?? IconGift,
        strokeColor: strokeColorMap[stat.label ?? ""] ?? "#6366f1",
        range
      }) as OverviewStatData
  )
}

export function useOverviewStatsData(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<OverviewStatData[]>(
    ["dashboard-stats", projectId, options?.range],
    `/dashboard/overview/${projectId}/stats?range=${options?.range ?? DashboardRange.WEEK}`,
    () => ({
      method: "get"
    }),
    {
      staleTime: 1000 * 60 * 2,
      refetchInterval: 1000 * 60 * 5,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      ...options
    }
  )

  return {
    ...query,
    data: query.data
      ? enrichDashboard2Stats(query.data, options?.range ?? DashboardRange.WEEK)
      : []
  }
}
