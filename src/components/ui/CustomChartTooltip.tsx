import React from "react"
import { TooltipProps } from "recharts"
import {
  NameType,
  ValueType
} from "recharts/types/component/DefaultTooltipContent"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

export interface CustomChartTooltipProps
  extends TooltipProps<ValueType, NameType> {
  chartConfig?: ChartConfig
}

export function CustomChartTooltip({
  active,
  payload,
  chartConfig
}: CustomChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const dateLabel =
    payload?.[0]?.payload?.tooltipDate ?? payload?.[0]?.payload?.day

  return (
    <div className="bg-background border-border min-w-32 rounded-md border px-2.5 py-2 shadow-lg">
      <div className="mb-1.5 text-xs font-semibold">{dateLabel}</div>
      {payload.map(item => (
        <div
          key={item.dataKey}
          className="mb-0.5 flex items-center justify-between"
        >
          <div className="flex items-center space-x-1">
            <span
              className="inline-block h-2 w-2 rounded-xs"
              style={{ background: item.color }}
            />
            <p className="text-foreground text-xs font-medium">
              {chartConfig?.[item.dataKey as string]?.label ?? item.dataKey}
            </p>
          </div>
          <p className="text-muted-foreground text-xs">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
