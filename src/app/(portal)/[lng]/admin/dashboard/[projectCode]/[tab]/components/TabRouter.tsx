"use client"

import { lazy, Suspense } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Lazy load tab components
const Overview = lazy(() => import("../overview/page"))
const Analytics = lazy(() => import("../analytics/page"))

// Tab loading skeleton
const TabSkeleton = () => (
  <div className="space-y-6">
    <div className="mb-4 flex justify-start">
      <div className="shine h-10 w-48 rounded-lg" />
    </div>
    <div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-6 lg:grid-cols-12">
      <div className="shine col-span-9 h-32 rounded-lg" />
      <div className="shine col-span-3 h-96 rounded-lg" />
      <div className="shine col-span-6 h-96 rounded-lg" />
      <div className="shine col-span-6 h-96 rounded-lg" />
    </div>
  </div>
)

interface TabRouterProps {
  defaultTab: "overview" | "analytics"
}

export default function TabRouter({ defaultTab }: TabRouterProps) {
  return (
    <Tabs
      orientation="vertical"
      defaultValue={defaultTab}
      className="space-y-4"
    >
      {/* <div className="w-full overflow-x-auto pb-2">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <IconSettings2 size={14} />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2"
          >
            <IconAnalyze size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>
      </div> */}

      <TabsContent value="overview" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <Overview />
        </Suspense>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <Analytics />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
