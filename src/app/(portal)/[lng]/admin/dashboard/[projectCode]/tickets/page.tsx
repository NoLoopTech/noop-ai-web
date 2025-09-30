"use client"

import { lazy, Suspense } from "react"
import { columns } from "./partials/TicketsColumns"

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
  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        </div>
      </div>
      <div className="flex-1">
        <Suspense fallback={<TableSkeleton />}>
          <TicketsTable columns={columns} />
        </Suspense>
      </div>
    </>
  )
}
