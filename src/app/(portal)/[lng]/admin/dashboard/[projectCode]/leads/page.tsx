"use client"

import { lazy, Suspense, useMemo } from "react"
import { columns } from "./partials/LeadsColumns"
import { FeatureGate } from "@/components/FeatureGate"
import { Feature } from "@/types/subscription"

const LeadsTable = lazy(() =>
  import("./partials/LeadsTable").then(module => ({
    default: module.LeadsTable
  }))
)

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="shine h-10 w-full rounded-lg" />
    <div className="shine h-96 w-full rounded-lg" />
    <div className="shine h-10 w-full rounded-lg" />
  </div>
)

export default function LeadsPage() {
  const memoizedColumns = useMemo(() => columns, [])

  return (
    <FeatureGate feature={Feature.LEADS_PAGE}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
        </div>
      </div>
      <div className="flex-1">
        <Suspense fallback={<TableSkeleton />}>
          <LeadsTable columns={memoizedColumns} />
        </Suspense>
      </div>
    </FeatureGate>
  )
}
