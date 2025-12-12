"use client"

import React from "react"
import Link from "next/link"
import { AlertCircle, TrendingUp } from "lucide-react"
import {
  useSubscription,
  useUsagePercentage
} from "@/lib/hooks/useSubscription"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface UsageIndicatorProps {
  limitType: "bots" | "sites" | "conversationsPerMonth"
  title?: string
  className?: string
  showUpgradePrompt?: boolean
}

const defaultTitles = {
  bots: "Bot Usage",
  sites: "Site Usage",
  conversationsPerMonth: "Monthly Conversations"
}

/**
 * Component to display usage of a specific subscription limit with progress bar
 *
 * @param limitType - The type of limit to display
 * @param title - Optional custom title
 * @param className - Optional className for styling
 * @param showUpgradePrompt - Whether to show upgrade prompt when near limit
 *
 * @example
 * <UsageIndicator limitType="conversationsPerMonth" />
 */
export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  limitType,
  title,
  className,
  showUpgradePrompt = true
}) => {
  const { data: subscription } = useSubscription()
  const usagePercent = useUsagePercentage(limitType)

  if (!subscription) return null

  const limit = subscription.limits[limitType]
  const usage =
    subscription.usage[
      limitType === "conversationsPerMonth"
        ? "conversationsThisMonth"
        : limitType
    ]
  const isUnlimited = limit === -1
  const isNearLimit = usagePercent >= 80
  const isAtLimit = usagePercent >= 100

  const displayTitle = title || defaultTitles[limitType]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
        <CardDescription>
          {isUnlimited ? (
            <span className="text-primary font-semibold">Unlimited</span>
          ) : (
            <span
              className={cn(
                "font-semibold",
                isAtLimit && "text-destructive",
                isNearLimit && !isAtLimit && "text-yellow-600"
              )}
            >
              {usage.toLocaleString()} / {limit.toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isUnlimited && (
          <>
            <Progress
              value={usagePercent}
              className={cn(
                "h-2",
                isAtLimit && "[&>div]:bg-destructive",
                isNearLimit && !isAtLimit && "[&>div]:bg-yellow-500"
              )}
            />
            {showUpgradePrompt && isNearLimit && (
              <div
                className={cn(
                  "mt-3 flex items-start gap-2 text-xs",
                  isAtLimit ? "text-destructive" : "text-yellow-600"
                )}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  {isAtLimit ? (
                    <>
                      You&apos;ve reached your limit.{" "}
                      <Link href="/pricing" className="font-medium underline">
                        Upgrade now
                      </Link>{" "}
                      to continue.
                    </>
                  ) : (
                    <>
                      You&apos;re nearing your limit. Consider{" "}
                      <Link href="/pricing" className="font-medium underline">
                        upgrading
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            )}
          </>
        )}
        {isUnlimited && (
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4" />
            <span>No limits on your current plan</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact inline version of usage indicator
 */
export const InlineUsageIndicator: React.FC<
  Omit<UsageIndicatorProps, "showUpgradePrompt">
> = ({ limitType, title, className }) => {
  const { data: subscription } = useSubscription()
  const usagePercent = useUsagePercentage(limitType)

  if (!subscription) return null

  const limit = subscription.limits[limitType]
  const usage =
    subscription.usage[
      limitType === "conversationsPerMonth"
        ? "conversationsThisMonth"
        : limitType
    ]
  const isUnlimited = limit === -1
  const isAtLimit = usagePercent >= 100

  const displayTitle = title || defaultTitles[limitType]

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{displayTitle}</span>
        <span className={cn("font-medium", isAtLimit && "text-destructive")}>
          {isUnlimited ? (
            <span className="text-primary">Unlimited</span>
          ) : (
            <>
              {usage.toLocaleString()} / {limit.toLocaleString()}
            </>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <Progress
          value={usagePercent}
          className={cn("h-1.5", isAtLimit && "[&>div]:bg-destructive")}
        />
      )}
    </div>
  )
}
