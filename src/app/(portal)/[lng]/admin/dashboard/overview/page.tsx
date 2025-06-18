"use client"

// Remove unused import
import { MetricCard } from "@/components/ui/metric-card"
import { Card } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { UsageBarChart } from "@/components/charts/usage-bar-chart"
import { TimeSpentLineChart } from "@/components/charts/time-spent-chart"
import { GeographyMap } from "@/components/charts/geography-map"

export default function OverviewPage(): JSX.Element {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <DateRangePicker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Conversations"
          value="1,500"
          change="+18%"
          timeSpan="from last 7 days"
          trend="up"
        />
        <MetricCard
          title="Avg Messages per Chat"
          value="+12,234"
          change="+19%"
          timeSpan="from last 7 days"
          trend="up"
          icon="message"
        />
        <MetricCard
          title="Bot Ratings"
          value="+573"
          change="+201"
          timeSpan="from last 7 days"
          trend="up"
          icon="activity"
        />
        <MetricCard
          title="Messages Sent"
          value="+2350"
          change="+12%"
          timeSpan="from last 7 days"
          trend="up"
          icon="mail"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Usage Graph</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                Trending up by 5.2%
                <svg className="w-3 h-3 ml-1" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4.5 9.5L9.5 4.5M9.5 4.5H5.5M9.5 4.5V8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="h-60">
              <UsageBarChart />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Time spent via Bot</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                Trending up by 5.2%
                <svg className="w-3 h-3 ml-1" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4.5 9.5L9.5 4.5M9.5 4.5H5.5M9.5 4.5V8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="h-60">
              <TimeSpentLineChart />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Link clicks</h3>
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M4.5 9.5L9.5 4.5M9.5 4.5H5.5M9.5 4.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-semibold">+573</span>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center text-green-600 dark:text-green-400">
                  +201 since last 7 days
                  <svg className="w-3 h-3 ml-1" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M4.5 9.5L9.5 4.5M9.5 4.5H5.5M9.5 4.5V8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">Country/Geo Breakdown</h3>
            <div className="h-80">
              <GeographyMap />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
