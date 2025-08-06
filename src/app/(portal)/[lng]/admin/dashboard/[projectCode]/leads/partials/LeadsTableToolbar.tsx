"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/layout/Table/DataTableFacetedFilter"
import { DataTableViewOptions } from "@/components/layout/Table/DataTableViewOptions"
import { leadStatus } from "../data/data"

interface Props<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* <Input
          placeholder="Filter Leads..."
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {/* Search filter */}
        <Input
          placeholder="Search username/email"
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Date filters */}
        {/* <Input
          type="date"
          value={
            (table.getColumn("startDate")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("startDate")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px]"
        />
        <Input
          type="date"
          value={(table.getColumn("endDate")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("endDate")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px]"
        /> */}
        {/* Score filter */}
        {table.getColumn("score") && (
          <DataTableFacetedFilter
            column={table.getColumn("score")}
            title="Score"
            options={[
              { label: "Cold Lead", value: "Cold Lead" },
              { label: "Warm Lead", value: "Warm Lead" },
              { label: "Hot Lead", value: "Hot Lead" }
            ]}
          />
        )}
        {/* Status filter - replaced Select with DataTableFacetedFilter */}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "New", value: "New" },
              { label: "Contacted", value: "Contacted" },
              { label: "Converted", value: "Converted" },
              { label: "Closed", value: "Closed" }
            ]}
          />
        )}
        {/* <div className="flex gap-x-2">
          {table.getColumn("score") && (
            <DataTableFacetedFilter
              column={table.getColumn("score")}
              title="Score"
              options={[
                { label: "Cold", value: "cold" },
                { label: "Warm", value: "warm" },
                { label: "Hot", value: "hot" }
              ]}
            />
          )}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={leadStatus.map(t => ({ ...t }))}
            />
          )}
        </div> */}
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
