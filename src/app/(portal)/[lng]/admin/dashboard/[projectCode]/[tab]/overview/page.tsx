"use client"

import { lazy, Suspense } from "react"
import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import Stats from "./partials/Stats"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { DashboardRange } from "@/models/dashboard"
import ComingSoon from "./partials/ComingSoon"
import { IconPlus, IconUserCheck } from "@tabler/icons-react"
import LazyInView from "@/components/LazyInView"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

const UsageGraph = lazy(() => import("./partials/UsageGraph"))
const BotRatings = lazy(() => import("./partials/BotRatings"))
const GeoBreakdownMap = lazy(() => import("./partials/GeoBreakdownMap"))
const LeadsAndTicketsGraph = lazy(
  () => import("./partials/LeadsAndTicketsGraph")
)

const LoadingCard = ({ className = "h-96" }: { className?: string }) => (
  <div className={`shine w-full rounded-md ${className}`} />
)

export default function Overview() {
  const projectId = useProjectCode()
  const { dateRange, setDateRange } = useDashboardFilters()

  const handleCreateProject = () => {
    redirect(`/get-started/`)
  }

  if (projectId === "no-project") {
    return (
      <div className="bg-background flex h-96 w-full flex-col items-center justify-center space-y-10">
        <div className="flex flex-col items-center space-y-5 text-center">
          <h2 className="text-foreground text-3xl font-semibold">
            Let’s get your first agent ready
          </h2>

          <p className="text-muted-foreground max-w-[700px] text-center">
            You haven’t set up an agent yet. Create one to unlock your
            dashboard, connect data, and start automating conversations.
          </p>
        </div>

        <Button onClick={handleCreateProject}>
          <IconPlus className="mr-1 h-4 w-4" />
          <span>Create New Agent</span>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-start">
        <DateRangeDropdown
          value={dateRange as DashboardRange}
          onChange={setDateRange}
        />
      </div>
      <div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-6 lg:grid-cols-12">
        <div className="col-span-9 grid grid-cols-6 gap-5">
          <Stats
            allowedLabels={[
              "Total Conversations",
              "Avg Messages per Chat",
              "Messages Sent"
            ]}
          />
        </div>
        <div className="col-span-3">
          {/* <BotRatings /> */}
          <Suspense fallback={<div className="shine h-96 w-full rounded-md" />}>
            <BotRatings />
          </Suspense>
        </div>

        <LazyInView
          className="col-span-3 md:col-span-6"
          fallback={<div className="shine h-96 w-full rounded-md" />}
          placeholder={<div className="bg-muted h-96 rounded-lg" />}
        >
          <UsageGraph />
        </LazyInView>

        <LazyInView
          className="col-span-3 md:col-span-6 lg:col-span-6"
          fallback={<LoadingCard className="h-96" />}
          placeholder={<div className="bg-muted h-96 rounded-lg" />}
        >
          <LeadsAndTicketsGraph />
        </LazyInView>
        <div className="col-span-12 grid grid-cols-12 gap-5">
          <div className="col-span-3 grid grid-cols-3 grid-rows-2 gap-5 md:col-span-3 lg:col-span-3">
            <div className="col-span-3 md:col-span-6 lg:col-span-3">
              <Stats
                allowedLabels={["Chat Confidence"]}
                isPercentage={true}
                showBadge={true}
                showChart={false}
              />
            </div>
            <div className="col-span-3 md:col-span-6 lg:col-span-3">
              {/* <Stats allowedLabels={["Escalations to Human"]} /> */}
              {/* TODO: Using ComingSoon component till we implement the feature */}
              <ComingSoon title="Escalations to Human" icon={IconUserCheck} />
            </div>
          </div>
          <LazyInView
            className="col-span-3 md:col-span-6 lg:col-span-9"
            fallback={<LoadingCard className="h-96" />}
            placeholder={<div className="bg-muted h-96 rounded-lg" />}
            threshold={0.2}
            rootMargin="50px"
          >
            <GeoBreakdownMap />
          </LazyInView>
        </div>
      </div>
    </>
  )
}
