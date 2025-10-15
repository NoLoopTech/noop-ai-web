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
