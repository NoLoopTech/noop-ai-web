import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { DashboardRange, dateRangeOptions } from "@/models/dashboard"
import { CalendarIcon } from "lucide-react"

function getDateRange(value: DashboardRange) {
  const today = new Date()
  const end = new Date(today)
  const start = new Date(today)
  start.setDate(today.getDate() - Number(value) + 1)
  // Format as YYYY-MM-DD for backend
  const format = (d: Date) => d.toISOString().slice(0, 10)
  return { startDate: format(start), endDate: format(end) }
}

function getDateRangeLabel(value: string): string {
  const today = new Date()
  const days = Number(value)
  const end = today
  const start = new Date(today)
  start.setDate(today.getDate() - days + 1)
  const format = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })
  return `${format(start)} - ${format(end)}`
}

export function DateRangeDropdown({
  value,
  onChange,
  onRangeChange,
  className
}: {
  value: DashboardRange
  onChange?: (v: DashboardRange) => void
  onRangeChange?: (range: {
    value: DashboardRange
    startDate: string
    endDate: string
  }) => void
  className?: string
}) {
  function handleChange(v: string) {
    const rangeValue = v as DashboardRange
    onChange?.(rangeValue)
    if (onRangeChange) {
      const { startDate, endDate } = getDateRange(rangeValue)
      onRangeChange({ value: rangeValue, startDate, endDate })
    }
  }
  return (
    <div className="flex items-center gap-3">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={className ?? "h-8 w-[120px] lg:w-[150px]"}>
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <CalendarIcon className="h-4 w-4" />
        <span>{getDateRangeLabel(value)}</span>
      </div>
    </div>
  )
}
