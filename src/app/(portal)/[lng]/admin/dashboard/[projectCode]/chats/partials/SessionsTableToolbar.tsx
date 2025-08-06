"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/layout/Table/DataTableViewOptions"
import { DataTableFacetedFilter } from "@/components/layout/Table/DataTableFacetedFilter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import countryDataJson from "@/lib/countryData.json"
import {
  dateRangeOptions,
  scoringOptions,
  durationOptions,
  type DateRangeType
} from "@/models/filterOptions"
import { Button } from "@/components/ui/button"
import { Cross2Icon } from "@radix-ui/react-icons"

interface SessionsTableFilters {
  username: string
  country: string
  scoring: string[]
  intent: string
  duration: string
  startDate: string
  endDate: string
  dateRangeType: DateRangeType
}

interface Props<TData> {
  table: Table<TData>
  filters: SessionsTableFilters
  setFilters: (filters: SessionsTableFilters) => void
}

export function SessionsTableToolbar<TData>({
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
          placeholder="Search by user name or email..."
          value={filters.username}
          onChange={e => setFilters({ ...filters, username: e.target.value })}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {/* <SingleSelectDropdown
          options={[...dateRangeOptions]}
          value={filters.dateRangeType}
          onChange={handleDateRangeChange}
          placeholder="Date Range"
          className="h-8 w-[150px] lg:w-[200px]"
        /> */}
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

        {table.getColumn("country") && (
          <DataTableFacetedFilter
            title="Country"
            options={countryDataJson.map(c => ({
              value: c.code,
              label: c.name
            }))}
            column={table.getColumn("country")}
          />
        )}
        {table.getColumn("aiScore") && (
          <DataTableFacetedFilter
            title="AI Score"
            options={[...scoringOptions]}
            column={table.getColumn("aiScore")}
          />
        )}
        <Select
          value={filters.duration || "all"}
          onValueChange={val => {
            setFilters({
              ...filters,
              duration: val === "all" ? "" : val
            })
          }}
        >
          <SelectTrigger className="h-8 w-[150px] lg:w-[180px]">
            <SelectValue placeholder="All Durations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            {durationOptions
              .filter(option => option.value !== "")
              .map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
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
