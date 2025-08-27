"use client"

import { DateRangeDropdown } from "@/components/DateRangeDropdown"
import Payments from "./partials/Payments"
import Sales from "./partials/Sales"
import Stats from "./partials/Stats"
import Subscription from "./partials/Subscriptions"
import TeamMembers from "./partials/TeamMembers"
import TotalRevenue from "./partials/TotalRevenue"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"
import { DashboardRange } from "@/models/dashboard"

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
      <div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-6 lg:grid-cols-9">
        <Stats />
        <div className="col-span-3">
          <TotalRevenue />
        </div>

        <div className="col-span-3 md:col-span-6">
          <Sales />
        </div>
        <div className="col-span-3 md:col-span-6 lg:col-span-3">
          <Subscription />
        </div>
        <div className="col-span-3 md:col-span-6 lg:col-span-5 xl:col-span-6">
          <Payments />
        </div>
        <div className="col-span-3 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <TeamMembers />
        </div>
      </div>
    </>
  )
}
