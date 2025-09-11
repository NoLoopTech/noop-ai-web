interface LegendPayloadItem {
  value: string
  color: string
}

interface CustomChartLegendProps {
  payload?: LegendPayloadItem[]
  valueToLabel?: Record<string, string>
  xAxisVisible?: boolean
}

export function CustomChartLegend({
  payload = [],
  valueToLabel = {},
  xAxisVisible = false
}: CustomChartLegendProps) {
  return (
    <div
      className={`m-0 mt-5 flex items-center ${xAxisVisible ? "ml-11" : "w-full justify-center"}`}
    >
      <ul className="flex w-full list-none items-center justify-center gap-4 p-0">
        {payload.map(entry => (
          <li key={entry.value} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-xs"
              style={{ background: entry.color }}
            />
            <span className="text-foreground text-xs font-normal">
              {valueToLabel[entry.value] ?? entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
