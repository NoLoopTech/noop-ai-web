"use client"

import React from "react"
import { Crown, Zap } from "lucide-react"
import { useSubscription } from "@/lib/hooks/useSubscription"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InlineUsageIndicator } from "./UsageIndicator"
import { Badge } from "@/components/ui/badge"

export interface SubscriptionOverviewProps {
  className?: string
  showUsageDetails?: boolean
}

/**
 * Component to display an overview of the user's subscription including tier and usage
 *
 * @param className - Optional className for styling
 * @param showUsageDetails - Whether to show detailed usage indicators (default: true)
 *
 * @example
 * <SubscriptionOverview />
 */
export const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  className,
  showUsageDetails = true
}) => {
  const { data: subscription, isLoading } = useSubscription()

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="animate-pulse space-y-3">
            <div className="bg-muted h-4 w-1/3 rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!subscription) return null

  const tierColors = {
    free: "bg-gray-500",
    starter: "bg-blue-500",
    growth: "bg-purple-500",
    pro: "bg-orange-500",
    enterprise: "bg-gradient-to-r from-yellow-500 to-orange-500"
  }

  const tierColor = tierColors[subscription.tier] || tierColors.free

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Crown
                className={`h-5 w-5 ${tierColor.includes("gradient") ? "text-yellow-500" : ""}`}
              />
              Current Plan
            </CardTitle>
            <CardDescription>
              Manage your subscription and track usage
            </CardDescription>
          </div>
          <Badge className={`${tierColor} text-white capitalize`}>
            {subscription.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUsageDetails && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4" />
                Usage Overview
              </h4>
              <div className="space-y-3">
                <InlineUsageIndicator limitType="bots" />
                <InlineUsageIndicator limitType="sites" />
                <InlineUsageIndicator limitType="conversationsPerMonth" />
              </div>
            </div>
          </div>
        )}

        {subscription.tier !== "enterprise" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/pricing")}
          >
            {subscription.tier === "free" ? "Upgrade Plan" : "View All Plans"}
          </Button>
        )}

        {subscription.tier === "enterprise" && (
          <div className="text-muted-foreground text-center text-sm">
            <p>Need to modify your plan?</p>
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
            >
              Contact your account manager
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
