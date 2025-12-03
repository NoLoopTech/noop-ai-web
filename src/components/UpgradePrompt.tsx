import React from "react"
import { Lock, Sparkles } from "lucide-react"
import { Feature } from "@/types/subscription"
import { useSubscription } from "@/lib/hooks/useSubscription"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface UpgradePromptProps {
  feature: Feature
  className?: string
}

const featureDisplayNames: Record<Feature, string> = {
  [Feature.LEAD_SCORING]: "Lead Scoring",
  [Feature.TICKET_CREATION]: "Ticket Creation",
  [Feature.CONFIDENCE_ESCALATION]: "Confidence Escalation",
  [Feature.EQ_AI_TONE]: "EQ AI Tone",
  [Feature.MULTILINGUAL_AUTO_REPLY]: "Multilingual Auto Reply",
  [Feature.OVERVIEW_CHATS_HISTORY]: "Chat History Overview",
  [Feature.LEADS_PAGE]: "Leads Management",
  [Feature.TICKETS_PAGE]: "Tickets Management",
  [Feature.ANALYTICS_TRENDS]: "Analytics & Trends",
  [Feature.BOT_SETTINGS]: "Bot Settings",
  [Feature.GENERAL_SETTINGS]: "General Settings",
  [Feature.PRIORITY_SUPPORT]: "Priority Support",
  [Feature.SLA_DEDICATED_MANAGER]: "SLA & Dedicated Manager"
}

/**
 * Component to display an upgrade prompt when a user tries to access a locked feature
 *
 * @param feature - The locked feature being accessed
 * @param className - Optional className for styling
 *
 * @example
 * <UpgradePrompt feature={Feature.LEAD_SCORING} />
 */
export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  className
}) => {
  const { data: subscription } = useSubscription()
  const featureName = featureDisplayNames[feature] || feature

  const handleUpgrade = () => {
    // TODO: Navigate to pricing/upgrade page
    // This could be a link to /pricing or a modal
    window.location.href = "/pricing"
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 rounded-full blur-xl" />
            <div className="bg-primary/10 relative rounded-full p-4">
              <Lock className="text-primary h-8 w-8" />
            </div>
          </div>
        </div>
        <CardTitle className="text-2xl">
          Upgrade to Access {featureName}
        </CardTitle>
        <CardDescription className="text-base">
          You&apos;re currently on the{" "}
          <span className="font-semibold capitalize">{subscription?.tier}</span>{" "}
          plan. Upgrade to unlock this feature and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Unlock powerful features to grow your business</span>
        </div>
        <Button onClick={handleUpgrade} size="lg" className="w-full sm:w-auto">
          View Upgrade Options
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Lightweight inline upgrade prompt for smaller UI elements
 */
export const InlineUpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  className
}) => {
  const featureName = featureDisplayNames[feature] || feature

  return (
    <div
      className={`bg-muted/50 flex items-center gap-2 rounded-lg border border-dashed p-4 ${className}`}
    >
      <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{featureName} is locked</p>
        <p className="text-muted-foreground text-xs">
          Upgrade your plan to access this feature
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = "/pricing")}
      >
        Upgrade
      </Button>
    </div>
  )
}
