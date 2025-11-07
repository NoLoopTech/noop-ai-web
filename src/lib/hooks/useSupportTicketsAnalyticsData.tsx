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
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...options
    }
  )
  return query
}
