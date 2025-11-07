import { DashboardRange } from "@/models/dashboard"
import { ConversationsAndAccuracy } from "@/models/conversations-analytics"
import { useApiQuery } from "@/query"

export function useConversationsAnalyticsData(
  projectId: number,
  options?: { enabled?: boolean; range?: string }
) {
  const query = useApiQuery<ConversationsAndAccuracy>(
    ["conversations-analytics", projectId, options?.range],
    `/dashboard/analytics/${projectId}/conversations?range=${options?.range ?? DashboardRange.WEEK}`,
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
