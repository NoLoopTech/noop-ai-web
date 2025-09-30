"use client"

import { lazy, Suspense } from "react"
import LazyInView from "@/components/LazyInView"

const BuyersProfileCard = lazy(() => import("./partials/BuyersProfileCard"))
const CustomersCard = lazy(() => import("./partials/CustomersCard"))
const SalesCard = lazy(() => import("./partials/SalesCard"))
const TrafficSourceCard = lazy(() => import("./partials/TrafficSourceCard"))
const VisitorsCard = lazy(() => import("./partials/VisitorsCard"))

const LoadingCard = ({ className = "h-full" }: { className?: string }) => (
  <div className={`shine w-full rounded-lg ${className}`} />
)

export default function Analytics() {
  return (
    <div className="grid auto-rows-auto grid-cols-6 gap-5">
      {/* Top row - Load immediately (above fold) */}
      <div className="col-span-6 xl:col-span-3">
        <Suspense fallback={<LoadingCard className="h-96" />}>
          <SalesCard />
        </Suspense>
      </div>
      <div className="col-span-6 xl:col-span-3">
        <Suspense fallback={<LoadingCard className="h-96" />}>
          <VisitorsCard />
        </Suspense>
      </div>

      {/* Bottom row - Load when visible (below fold) */}
      <LazyInView
        className="col-span-6 lg:col-span-3 xl:col-span-2"
        fallback={<LoadingCard className="h-64" />}
        placeholder={<div className="bg-muted h-64 rounded-lg" />}
      >
        <TrafficSourceCard />
      </LazyInView>

      <LazyInView
        className="col-span-6 lg:col-span-3 xl:col-span-2"
        fallback={<LoadingCard className="h-64" />}
        placeholder={<div className="bg-muted h-64 rounded-lg" />}
      >
        <CustomersCard />
      </LazyInView>

      <LazyInView
        className="col-span-6 lg:col-span-3 xl:col-span-2"
        fallback={<LoadingCard className="h-64" />}
        placeholder={<div className="bg-muted h-64 rounded-lg" />}
      >
        <BuyersProfileCard />
      </LazyInView>
    </div>
  )
}
