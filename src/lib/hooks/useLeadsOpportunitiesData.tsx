import { DashboardRange } from "@/models/dashboard"
import { LeadsAndOpportunities } from "@/models/leads-opportunities-analytics"
import { useApiQuery } from "@/query"

export function useLeadsOpportunitiesData(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<LeadsAndOpportunities>(
    ["leads-opportunities-analytics", projectId, options?.range],
    `/dashboard/analytics/${projectId}/leads-and-opportunities?range=${options?.range ?? DashboardRange.WEEK}`,
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

  return query
}
