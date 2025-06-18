"use client"

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Sun", value: 2 },
  { name: "Mon", value: 4 },
  { name: "Tue", value: 15 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 7 },
  { name: "Fri", value: 7 },
  { name: "Sat", value: 6 }
]

export function TimeSpentLineChart(): JSX.Element {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
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
          cursor={false}
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
                        {payload[0].value} minutes
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          dot={false}
          className="stroke-gray-800 dark:stroke-white"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
