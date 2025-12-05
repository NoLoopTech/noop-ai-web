import { useApiQuery } from "@/query"
import { SubscriptionInfo, Feature } from "@/types/subscription"
import { useProjectCode } from "./useProjectCode"

/**
 * Hook to fetch and cache user's subscription information
 *
 * @returns Query result containing subscription info with tier, limits, usage, and features
 *
 * @example
 * const { data: subscription, isLoading } = useSubscription()
 */
export const useSubscription = () => {
  const selectedProjectId = useProjectCode()

  return useApiQuery<SubscriptionInfo>(
    ["subscription"],
    `subscription/info`,
    () => ({
      method: "get"
    }),
    {
      enabled: !!selectedProjectId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000 // 10 minutes (formerly cacheTime in v4)
    }
  )
}

/**
 * Hook to check if user has access to a specific feature
 *
 * @param feature - The feature to check access for
 * @returns boolean indicating if user has access to the feature
 *
 * @example
 * const hasLeadScoring = useFeatureAccess(Feature.LEAD_SCORING)
 * if (hasLeadScoring) {
 *   // Show lead scoring UI
 * }
 */
export const useFeatureAccess = (feature: Feature): boolean => {
  const { data: subscription, isLoading } = useSubscription()

  if (isLoading) return false

  return subscription?.features?.includes(feature) ?? false
}

/**
 * Hook to get usage percentage for a specific limit type
 *
 * @param limitType - The type of limit to check ('bots' | 'sites' | 'conversationsPerMonth')
 * @returns Percentage (0-100) of limit used, or 0 if unlimited
 *
 * @example
 * const usagePercent = useUsagePercentage('conversationsPerMonth')
 * // Returns 45 if 450/1000 conversations used
 */
export const useUsagePercentage = (
  limitType: "bots" | "sites" | "conversationsPerMonth"
): number => {
  const { data: subscription } = useSubscription()

  if (!subscription) return 0

  const limit = subscription.limits[limitType]
  const usage =
    subscription.usage[
      limitType === "conversationsPerMonth"
        ? "conversationsThisMonth"
        : limitType
    ]

  if (limit === -1) return 0 // Unlimited

  return Math.min(100, (usage / limit) * 100)
}
