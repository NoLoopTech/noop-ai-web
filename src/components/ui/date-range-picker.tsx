"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DateRangePicker(): React.ReactElement {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-auto justify-start text-left font-normal",
        "bg-white text-gray-700 dark:bg-zinc-900 dark:text-gray-300"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      <span>Feb 03, 2025 - Feb 09, 2025</span>
    </Button>
  )
}
