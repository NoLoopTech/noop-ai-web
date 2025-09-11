"use client"

import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import Stats from "./partials/Stats"
import UsageGraph from "./partials/UsageGraph"
import BotRatings from "./partials/BotRatings"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { DashboardRange } from "@/models/dashboard"
import GeoBreakdownMap from "./partials/GeoBreakdownMap"
import LeadsAndTicketsGraph from "./partials/LeadsAndTicketsGraph"
import ComingSoon from "./partials/ComingSoon"
import { IconUserCheck } from "@tabler/icons-react"

export default function Overview() {
  const { dateRange, setDateRange } = useDashboardFilters()

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
          <BotRatings />
        </div>

        <div className="col-span-3 md:col-span-6">
          <UsageGraph />
        </div>
        <div className="col-span-3 md:col-span-6 lg:col-span-6">
          <LeadsAndTicketsGraph />
        </div>
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
          <div className="col-span-3 md:col-span-6 lg:col-span-9">
            <GeoBreakdownMap />
          </div>
        </div>
      </div>
    </>
  )
}
