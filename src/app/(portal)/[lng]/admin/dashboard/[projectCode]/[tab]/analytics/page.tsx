"use client"

import { lazy, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconChartBar,
  IconMessages,
  IconUsers,
  IconTicket
} from "@tabler/icons-react"
import { useSmartHighlightsData } from "@/lib/hooks/useSmartHighlightsData"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { useTrafficEngagementAnalyticsData } from "@/lib/hooks/useTrafficEngagementAnalyticsData"
import { useConversationsAnalyticsData } from "@/lib/hooks/useConversationsAnalyticsData"
import { useLeadsOpportunitiesData } from "@/lib/hooks/useLeadsOpportunitiesData"
import { useSupportTicketsAnalyticsData } from "@/lib/hooks/useSupportTicketsAnalyticsData"
import { FeatureGate } from "@/components/FeatureGate"
import { Feature } from "@/types/subscription"
import { useFeatureAccess } from "@/lib/hooks/useSubscription"

const ConversationsTab = lazy(() => import("./partials/ConversationsTab"))
const TrafficEngagementTab = lazy(
  () => import("./partials/TrafficEngagementTab")
)
const LeadsOpportunitiesTab = lazy(
  () => import("./partials/LeadsOpportunitiesTab")
)
const SupportTicketTab = lazy(() => import("./partials/SupportTicketTab"))

const TabSkeleton = () => (
  <div className="space-y-6">
    <div className="grid auto-rows-auto grid-cols-6 gap-5">
      <div className="shine col-span-6 h-96 rounded-lg" />
      <div className="shine col-span-6 h-96 rounded-lg" />
    </div>
  </div>
)

export default function Analytics() {
  const projectCode = useProjectCode()
  const projectId = typeof projectCode === "number" ? projectCode : 0

  const { dateRange } = useDashboardFilters()

  const hasAccess = useFeatureAccess(Feature.ANALYTICS_TRENDS)

  // Only fetch if user has access to the feature
  const {
    data: smartHighlightsData,
    isLoading: isLoadingHighlights,
    isError: isErrorHighlights
  } = useSmartHighlightsData(projectId, { enabled: !!projectId && hasAccess })

  const { data: trafficEngagementData, isLoading: isLoadingTrafficEngagement } =
    useTrafficEngagementAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId && hasAccess
    })

  const { data: conversationsData, isLoading: isLoadingConversations } =
    useConversationsAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId && hasAccess
    })

  const {
    data: leadsOpportunitiesData,
    isLoading: isLoadingLeadsOpportunities
  } = useLeadsOpportunitiesData(projectId, {
    range: dateRange,
    enabled: !!projectId && hasAccess
  })

  const { data: supportTicketsData, isLoading: isLoadingSupportTickets } =
    useSupportTicketsAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId && hasAccess
    })

  return (
    <FeatureGate feature={Feature.ANALYTICS_TRENDS}>
      <Tabs defaultValue="traffic-engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger
            value="traffic-engagement"
            className="flex items-center gap-2"
          >
            <IconChartBar size={16} />
            <span className="hidden sm:inline">Traffic & Engagement</span>
            <span className="sm:hidden">Track</span>
          </TabsTrigger>
          <TabsTrigger
            value="conversations"
            className="flex items-center gap-2"
          >
            <IconMessages size={16} />
            Conversations
          </TabsTrigger>
          <TabsTrigger
            value="leads-opportunities"
            className="flex items-center gap-2"
          >
            <IconUsers size={16} />
            <span className="hidden sm:inline">Leads & Opportunities</span>
            <span className="sm:hidden">Leads</span>
          </TabsTrigger>
          <TabsTrigger
            value="support-ticket"
            className="flex items-center gap-2"
          >
            <IconTicket size={16} />
            <span className="hidden sm:inline">Support & Ticket</span>
            <span className="sm:hidden">Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic-engagement" className="space-y-4">
          <Suspense fallback={<TabSkeleton />}>
            <TrafficEngagementTab
              data={trafficEngagementData}
              isLoading={isLoadingTrafficEngagement}
              smartHighlightsData={smartHighlightsData}
              isLoadingHighlights={isLoadingHighlights}
              isErrorHighlights={isErrorHighlights}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Suspense fallback={<TabSkeleton />}>
            <ConversationsTab
              data={conversationsData}
              isLoading={isLoadingConversations}
              smartHighlightsData={smartHighlightsData}
              isLoadingHighlights={isLoadingHighlights}
              isErrorHighlights={isErrorHighlights}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="leads-opportunities" className="space-y-4">
          <Suspense fallback={<TabSkeleton />}>
            <LeadsOpportunitiesTab
              data={leadsOpportunitiesData}
              isLoading={isLoadingLeadsOpportunities}
              smartHighlightsData={smartHighlightsData}
              isLoadingHighlights={isLoadingHighlights}
              isErrorHighlights={isErrorHighlights}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="support-ticket" className="space-y-4">
          <Suspense fallback={<TabSkeleton />}>
            <SupportTicketTab
              data={supportTicketsData}
              isLoading={isLoadingSupportTickets}
              smartHighlightsData={smartHighlightsData}
              isLoadingHighlights={isLoadingHighlights}
              isErrorHighlights={isErrorHighlights}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </FeatureGate>
  )
}
