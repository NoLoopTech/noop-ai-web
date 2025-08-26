import { ForwardRefExoticComponent, RefAttributes } from "react"
import {
  Icon,
  IconGift,
  IconMenuOrder,
  IconProps,
  IconMessages,
  IconSubscript
} from "@tabler/icons-react"
import { useApiQuery } from "@/query"

const iconMap: Record<
  string,
  ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
> = {
  "Total Conversations": IconMessages,
  "New Orders": IconMenuOrder,
  "Avg Order Revenue": IconGift
}

const strokeColorMap: Record<string, string> = {
  "Total Conversations": "var(--chart-1)",
  "New Orders": "var(--chart-2)",
  "Avg Order Revenue": "#6366f1"
}

function enrichDashboard2Stats(
  stats: Partial<Dashboard2Stats>[],
  range: string
): Dashboard2Stats[] {
  return stats.map(
    stat =>
      ({
        ...stat,
        icon: iconMap[stat.label ?? ""] ?? IconGift,
        strokeColor: strokeColorMap[stat.label ?? ""] ?? "#6366f1",
        range
      }) as Dashboard2Stats
  )
}

export function useDashboard2Stats(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<Dashboard2Stats[]>(
    ["dashboard-stats", projectId, options?.range],
    `/dashboard/overview/${projectId}/stats?range=${options?.range ?? "7"}`,
    () => ({
      method: "get"
    }),
    options
  )

  return {
    ...query,
    data: query.data
      ? enrichDashboard2Stats(query.data, options?.range ?? "7")
      : []
  }
}

export const dummyStats: Dashboard2Stats[] = [
  {
    label: "Total Conversations",
    description: "Total number of conversations",
    stats: 4682,
    type: "up",
    percentage: 15.54,
    chartData: [
      { month: "Monday", value: 200 },
      { month: "Tuesday", value: 305 },
      { month: "Webnesday", value: 237 },
      { month: "Thursday", value: 73 },
      { month: "Friday", value: 209 },
      { month: "Saturday", value: 10 },
      { month: "Sunday", value: 214 }
    ],
    strokeColor: "var(--chart-1)",
    icon: IconSubscript,
    range: "7"
  },
  {
    label: "New Orders",
    description: "Total number of new orders",
    stats: 1226,
    type: "down",
    percentage: 40.2,
    chartData: [
      { month: "Monday", value: 186 },
      { month: "Tuesday", value: 305 },
      { month: "Webnesday", value: 237 },
      { month: "Thursday", value: 73 },
      { month: "Friday", value: 209 },
      { month: "Saturday", value: 214 },
      { month: "Sunday", value: 214 }
    ],
    strokeColor: "var(--chart-2)",
    icon: IconMenuOrder,
    range: "7"
  },
  {
    label: "Avg Order Revenue",
    description: "Average order of revenue",
    stats: 1080,
    type: "up",
    percentage: 10.8,
    chartData: [
      { month: "Monday", value: 50 },
      { month: "Tuesday", value: 125 },
      { month: "Webnesday", value: 240 },
      { month: "Thursday", value: 93 },
      { month: "Friday", value: 209 },
      { month: "Saturday", value: 150 },
      { month: "Sunday", value: 300 }
    ],
    strokeColor: "#6366f1",
    icon: IconGift,
    range: "7"
  }
]

export type Dashboard2Stats = {
  label: string
  description: string
  stats: number
  type: "up" | "down"
  percentage: number
  chartData: {
    [x: string]: PropertyKey
    value: number
  }[]
  strokeColor: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
  range: string
}
