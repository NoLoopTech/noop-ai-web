import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { DashboardRange, dateRangeOptions } from "@/models/dashboard"
import { CalendarIcon } from "lucide-react"

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
  className
}: {
  value: DashboardRange
  onChange: (v: DashboardRange) => void
  className?: string
}) {
  function handleChange(v: string) {
    onChange(v as DashboardRange)
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={cn("h-8 w-[120px] lg:w-[150px]", className)}>
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

      <div className="text-muted-foreground flex items-center gap-2 rounded-md border border-slate-300/65 px-3 py-[5px] text-sm dark:border-slate-800">
        <CalendarIcon className="h-4 w-4" />
        <span>{getDateRangeLabel(value)}</span>
      </div>
    </div>
  )
}
