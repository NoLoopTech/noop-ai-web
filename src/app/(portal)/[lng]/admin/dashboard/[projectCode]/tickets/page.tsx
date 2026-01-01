"use client"

import { lazy, Suspense, useMemo } from "react"
import { columns } from "./partials/TicketsColumns"
import { FeatureGate } from "@/components/FeatureGate"
import { Feature } from "@/types/subscription"

const TicketsTable = lazy(() =>
  import("./partials/TicketsTable").then(module => ({
    default: module.TicketsTable
  }))
)

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="shine h-10 w-full rounded-lg" />
    <div className="shine h-96 w-full rounded-lg" />
    <div className="shine h-10 w-full rounded-lg" />
  </div>
)

export default function TicketsPage() {
  const memoizedColumns = useMemo(() => columns, [])

  return (
    <FeatureGate feature={Feature.TICKETS_PAGE}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        </div>
      </div>
      <div className="flex-1">
        <Suspense fallback={<TableSkeleton />}>
          <TicketsTable columns={memoizedColumns} />
        </Suspense>
      </div>
    </FeatureGate>
  )
}
