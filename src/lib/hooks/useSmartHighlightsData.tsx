import { useApiQuery } from "@/query"

export interface SmartHighlightsResponse {
  bullets: string[]
  overall: string
}

export interface UseSmartHighlightsOptions {
  enabled?: boolean
}

/**
 * Hook to fetch smart highlights data for a specific project
 *
 * This hook makes a single API call that is shared across all tabs via React Query cache.
 * When you switch between tabs, it will use the cached data instead of making new requests.
 *
 * @param projectId - The project ID to fetch smart highlights for
 * @param options - Additional query options (enabled)
 * @returns React Query result with smart highlights data
 *
 * @example
 * ```tsx
 * const { data, isLoading, isError } = useSmartHighlightsData(123)
 * ```
 */
export function useSmartHighlightsData(
  projectId: number,
  options?: UseSmartHighlightsOptions
) {
  const query = useApiQuery<SmartHighlightsResponse>(
    ["smart-highlights", projectId],
    `/dashboard/analytics/${projectId}/smart-highlights`,
    () => ({
      method: "get"
    }),
    {
      // Smart highlights take ~15s to generate, so we want longer stale time
      staleTime: 1000 * 60 * 5,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: 2000,
      ...options
    }
  )

  return query
}
