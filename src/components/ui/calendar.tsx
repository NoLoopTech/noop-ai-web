"use client"

import React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3.5", className)}
      classNames={{
        chevron: `w-6 h-6 size-4 fill-gray-500 p-1 rounded-sm border border-slate-200 dark:border-gray-800 hover:bg-slate-100 dark:hover:bg-gray-800`,
        caption_label: "flex items-center text-sm font-semibolds",
        day_button:
          "flex h-8 w-8 items-center justify-center rounded-md aria-selected:shadow-sm aria-selected:transition-colors focus",
        day: "whitespace-nowrap rounded-md text-xs font-medium transition-colors dark:hover:bg-accent/50 hover:bg-slate-200",
        selected:
          "bg-primary/70 rounded-md text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground hover:bg-slate-500 hover:text-slate-100",
        today:
          "dark:bg-accent dark:text-accent-foreground bg-slate-300/75 text-slate-900 dark:hover:bg-accent/50 hover:bg-slate-400/60",
        outside: "text-slate-400/80 dark:text-gray-700",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames
      }}
      navLayout="around"
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
