import React from "react"
import { Feature } from "@/types/subscription"
import { useFeatureAccess } from "@/lib/hooks/useSubscription"

export interface FeatureGateProps {
  feature: Feature
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgradePrompt?: boolean
}

/**
 * Component to conditionally render UI based on subscription tier feature access
 *
 * @param feature - The feature to check access for
 * @param children - Content to show if user has access
 * @param fallback - Content to show if user doesn't have access (optional)
 * @param showUpgradePrompt - Whether to show upgrade prompt if no fallback provided (default: true)
 *
 * @example
 * <FeatureGate feature={Feature.LEADS_PAGE}>
 *   <LeadsContent />
 * </FeatureGate>
 *
 * @example
 * <FeatureGate
 *   feature={Feature.TICKET_CREATION}
 *   fallback={<LockedFeatureMessage />}
 * >
 *   <CreateTicketButton />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true
}) => {
  const hasAccess = useFeatureAccess(feature)

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>
    if (showUpgradePrompt) {
      // Dynamic import to avoid circular dependencies
      const UpgradePrompt = React.lazy(() =>
        import("./UpgradePrompt").then(module => ({
          default: module.UpgradePrompt
        }))
      )
      return (
        <React.Suspense fallback={null}>
          <UpgradePrompt feature={feature} />
        </React.Suspense>
      )
    }
    return null
  }

  return <>{children}</>
}
