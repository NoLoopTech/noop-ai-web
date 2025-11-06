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
      staleTime: 1000 * 60 * 2,
      refetchInterval: 1000 * 60 * 5,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      ...options
    }
  )
  return query
}
