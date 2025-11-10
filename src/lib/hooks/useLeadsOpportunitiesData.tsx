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
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...options
    }
  )

  return query
}
