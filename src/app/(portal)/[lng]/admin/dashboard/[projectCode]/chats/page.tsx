"use client"

import { lazy, Suspense } from "react"
import { columns } from "./partials/SessionsColumns"

const SessionsTable = lazy(() =>
  import("./partials/SessionsTable").then(module => ({
    default: module.SessionsTable
  }))
)

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="shine h-10 w-full rounded-lg" />
    <div className="shine h-96 w-full rounded-lg" />
    <div className="shine h-10 w-full rounded-lg" />
  </div>
)

export default function SessionsPage() {
  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
        </div>
      </div>
      <div className="flex-1">
        <Suspense fallback={<TableSkeleton />}>
          <SessionsTable columns={columns} />
        </Suspense>
      </div>
    </>
  )
}
