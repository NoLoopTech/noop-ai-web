import { DashboardRange } from "@/models/dashboard"
import { SupportAndTickets } from "@/models/support-tickets-analytics"
import { useApiQuery } from "@/query"

export function useSupportTicketsAnalyticsData(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<SupportAndTickets>(
    ["support-tickets-analytics", projectId, options?.range],
    `/dashboard/analytics/${projectId}/support-and-tickets?range=${options?.range ?? DashboardRange.WEEK}`,
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
