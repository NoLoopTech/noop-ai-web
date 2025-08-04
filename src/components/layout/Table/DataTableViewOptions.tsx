"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface Props<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: Props<TData>) {
  // const columnLabels: Record<string, string> = {
  //   select: "Select",
  //   userName: "User Name",
  //   email: "Email",
  //   phoneNumber: "Number",
  //   preference: "Preference",
  //   score: "Score",
  //   status: "Status",
  //   createdAt: "Date",
  //   actions: "Actions"
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* {table
          .getAllColumns()
          .filter(
            column =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })} */}

        {/* {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => {
            // Try to get a string label from columnDef.header, else fallback to column.id
            let label =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id

            // If header is a React element, you can add more logic to extract text if needed

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })} */}

        {/* {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => {
            // Use mapping, fallback to header or id
            let label =
              columnLabels[column.id] ||
              (typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id)

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })} */}

        {/* {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => {
            // Use meta.label if available, else fallback to string header, else id
            const label =
              column.columnDef.meta?.label ||
              (typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id)

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })} */}

        {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => {
            // Use meta.label if available, else fallback to string header, else id
            const label =
              column.columnDef.meta?.label ||
              (typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id)

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
