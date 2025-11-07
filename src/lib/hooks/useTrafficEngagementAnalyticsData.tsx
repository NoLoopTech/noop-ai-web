import { DashboardRange } from "@/models/dashboard"
import { TrafficAndEngagement } from "@/models/traffic-engagement-analytics"
import { useApiQuery } from "@/query"

export function useTrafficEngagementAnalyticsData(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<TrafficAndEngagement>(
    ["traffic-engagement-analytics", projectId, options?.range],
    `/dashboard/analytics/${projectId}/traffic-engagement?range=${options?.range ?? DashboardRange.WEEK}`,
    () => ({ method: "get" }),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...options
    }
  )
  return query
}
