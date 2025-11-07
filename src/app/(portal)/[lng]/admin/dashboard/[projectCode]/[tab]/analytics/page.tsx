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
  const projectId = useProjectCode() ?? 0

  // Fetch smart highlights once at parent level, shared across all tabs
  const {
    data: smartHighlightsData,
    isLoading: isLoadingHighlights,
    isError: isErrorHighlights
  } = useSmartHighlightsData(projectId)

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
            smartHighlightsData={smartHighlightsData}
            isLoadingHighlights={isLoadingHighlights}
            isErrorHighlights={isErrorHighlights}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="conversations" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <ConversationsTab
            smartHighlightsData={smartHighlightsData}
            isLoadingHighlights={isLoadingHighlights}
            isErrorHighlights={isErrorHighlights}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="leads-opportunities" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <LeadsOpportunitiesTab
            smartHighlightsData={smartHighlightsData}
            isLoadingHighlights={isLoadingHighlights}
            isErrorHighlights={isErrorHighlights}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="support-ticket" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <SupportTicketTab
            smartHighlightsData={smartHighlightsData}
            isLoadingHighlights={isLoadingHighlights}
            isErrorHighlights={isErrorHighlights}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
