"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/layout/Table/DataTableFacetedFilter"
import { DataTableViewOptions } from "@/components/layout/Table/DataTableViewOptions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ticketStatus } from "@/models/ticket/options"
import { dateRangeOptions, type DateRangeType } from "@/models/filterOptions"

interface TicketTableFilters {
  searchTerm: string
  startDate: string
  endDate: string
  dateRangeType: DateRangeType
}

interface Props<TData> {
  table: Table<TData>
  filters: TicketTableFilters
  setFilters: (filters: TicketTableFilters) => void
}

export function DataTableToolbar<TData>({
  table,
  filters,
  setFilters
}: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleDateRangeChange = (val: string) => {
    const range = val as DateRangeType
    const today = new Date()
    const start = new Date(today)
    const end = new Date(today)

    if (range === "today") {
      // Today is already set
    } else if (range === "yesterday") {
      start.setDate(today.getDate() - 1)
      end.setDate(today.getDate() - 1)
    } else if (range === "last7") {
      start.setDate(today.getDate() - 6)
    } else if (range === "last30") {
      start.setDate(today.getDate() - 29)
    } else if (range === "last90") {
      start.setDate(today.getDate() - 89)
    }

    setFilters({
      ...filters,
      dateRangeType: range,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10)
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Search by username or email..."
          value={filters.searchTerm}
          onChange={event =>
            setFilters({ ...filters, searchTerm: event.target.value })
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Date Range Filter */}
        <Select
          value={filters.dateRangeType || "reset"}
          onValueChange={val => {
            if (val === "reset") {
              setFilters({
                ...filters,
                dateRangeType: "" as DateRangeType,
                startDate: "",
                endDate: ""
              })
            } else {
              handleDateRangeChange(val)
            }
          }}
        >
          <SelectTrigger className="h-8 w-[150px] lg:w-[200px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reset">Reset</SelectItem>
            {dateRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Date Range Button */}
        {(filters.dateRangeType || filters.startDate || filters.endDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters({
                ...filters,
                dateRangeType: "" as DateRangeType,
                startDate: "",
                endDate: ""
              })
            }
            className="h-8"
          >
            Reset Date Range
          </Button>
        )}

        <div className="flex gap-x-2">
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" }
              ]}
            />
          )}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={Object.entries(ticketStatus).map(([value, [label]]) => ({
                label,
                value
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
