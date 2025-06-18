"use client"

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Sun", value: 6 },
  { name: "Mon", value: 3 },
  { name: "Tue", value: 1 },
  { name: "Wed", value: 4 },
  { name: "Thu", value: 8 },
  { name: "Fri", value: 3 },
  { name: "Sat", value: 6 }
]

export function UsageBarChart(): JSX.Element {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickMargin={10}
          stroke="currentColor"
          className="text-muted-foreground"
        />
        <Tooltip
          cursor={{
            fill: "var(--tooltip-cursor-fill)",
            className: "dark:fill-opacity-10 fill-opacity-5"
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-zinc-950">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {payload[0].payload.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          barSize={20}
          className="fill-gray-800 dark:fill-white"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
