"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart"
import { CustomChartLegend } from "@/components/CustomChartLegend"
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip"

const chartData = [
  { day: "Jan 1", leads: 186, tickets: 80 },
  { day: "Jan 2", leads: 305, tickets: 200 },
  { day: "Jan 3", leads: 237, tickets: 120 },
  { day: "Jan 4", leads: 73, tickets: 190 },
  { day: "Jan 5", leads: 209, tickets: 130 },
  { day: "Jan 6", leads: 214, tickets: 140 }
]

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-usage-green)"
  },
  tickets: {
    label: "Tickets",
    color: "var(--chart-usage-orange)"
  }
} satisfies ChartConfig

const valueToLabelMap = {
  leads: "Leads",
  tickets: "Tickets"
}

export default function Sales() {
  return (
    <Card className="h-96">
      <CardHeader className="flex flex-col space-y-0.5">
        <CardTitle className="text-base font-semibold">
          Leads and Tickets Over Time
        </CardTitle>
        <CardDescription className="text-sm">
          Trending up by 5.2%
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_90px)]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              // margin={{
              //   left: 12,
              //   right: 12
              // }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{
                  value: "Tickets & Leads Count",
                  angle: -90,
                  position: "insideLeft",
                  offset: 5,
                  style: { textAnchor: "middle" }
                }}
              />
              <Legend
                content={<CustomChartLegend valueToLabel={valueToLabelMap} />}
              />
              <ChartTooltip
                cursor={true}
                content={<CustomChartTooltip chartConfig={chartConfig} />}
              />

              <defs>
                <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-usage-green)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-usage-green)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-usage-orange)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-usage-orange)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <Area
                dataKey="tickets"
                type="natural"
                fill="url(#fillTickets)"
                fillOpacity={0.4}
                stroke="var(--chart-usage-orange)"
                stackId="a"
              />
              <Area
                dataKey="leads"
                type="natural"
                fill="url(#fillLeads)"
                fillOpacity={0.4}
                stroke="var(--chart-usage-green)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
