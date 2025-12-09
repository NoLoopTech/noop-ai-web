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

  // Fetch smart highlights once at parent level, shared across all tabs
  const {
    data: smartHighlightsData,
    isLoading: isLoadingHighlights,
    isError: isErrorHighlights
  } = useSmartHighlightsData(projectId)

  // Prefetch all tab data simultaneously for instant tab switching
  const { data: trafficEngagementData, isLoading: isLoadingTrafficEngagement } =
    useTrafficEngagementAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId
    })

  const { data: conversationsData, isLoading: isLoadingConversations } =
    useConversationsAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId
    })

  const {
    data: leadsOpportunitiesData,
    isLoading: isLoadingLeadsOpportunities
  } = useLeadsOpportunitiesData(projectId, {
    range: dateRange,
    enabled: !!projectId
  })

  const { data: supportTicketsData, isLoading: isLoadingSupportTickets } =
    useSupportTicketsAnalyticsData(projectId, {
      range: dateRange,
      enabled: !!projectId
    })

  return (
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
        <TabsTrigger value="conversations" className="flex items-center gap-2">
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
        <TabsTrigger value="support-ticket" className="flex items-center gap-2">
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
  )
}
