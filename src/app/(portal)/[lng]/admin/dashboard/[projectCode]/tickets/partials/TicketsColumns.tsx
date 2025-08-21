"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/layout/Table/DataTableColumnHeader"
import { Ticket } from "@/models/ticket/schema"
import {
  ticketMethod,
  ticketPriority,
  ticketStatus,
  ticketTypes
} from "@/models/ticket/options"
import { TicketsTableRowActions } from "./TicketsTableRowActions"
import { TicketsRowInfoAction } from "./TicketsRowInfoAction"
import CountryFlag from "react-country-flag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { getCountryName } from "@/utils"

export const columns: ColumnDef<Ticket>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="align-top"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted pr-2! md:pr-0"
      )
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="align-top"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="w-36 pl-3.5"
        title="Ticket ID"
      />
    ),
    id: "id",
    cell: TicketsRowInfoAction,
    meta: { label: "Ticket ID", className: "" }
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("userName")}</div>
    ),
    meta: { label: "User Name", className: "" }
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
    meta: { label: "Email", className: "" }
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("country") as string | undefined
      if (!value || value.toUpperCase() === "N/A") {
        return <span>N/A</span>
      }
      const code = value.toUpperCase()
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-2">
              <CountryFlag
                countryCode={code}
                svg
                style={{ width: "1.6em", height: "1.5em" }}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={-45}
            side="right"
            align="center"
            className="text-tiny bg-background text-foreground capitalize shadow"
          >
            <span>{getCountryName(code)}</span>
          </TooltipContent>
        </Tooltip>
      )
    },
    meta: { label: "Country", className: "" }
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("content")}</div>
    ),
    meta: { label: "Content", className: "" }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | keyof typeof ticketStatus
        | undefined
      const ticketObj = status ? ticketStatus[status] : undefined

      if (!ticketObj) {
        return (
          <span className="text-muted-foreground italic">
            {status ?? "N/A"}
          </span>
        )
      }

      const [label, className] = ticketObj

      return (
        <div
          className={`w-max rounded-md border px-3 py-0.5 text-center text-xs capitalize ${className}`}
        >
          {label}
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priorityValue = row.getValue("priority") as string | undefined
      if (!priorityValue) {
        return <span className="text-muted-foreground italic">N/A</span>
      }

      const priority = ticketPriority.find(p => p.value === priorityValue)
      if (!priority) {
        return (
          <span className="text-muted-foreground italic">{priorityValue}</span>
        )
      }

      return (
        <div className="flex items-center gap-x-2">
          {priority.icon && (
            <priority.icon size={16} className="text-chip-default-gray" />
          )}
          <span className="text-chip-default-gray capitalize">
            {priority.label}
          </span>
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = ticketTypes.find(t => t.value === row.getValue("type"))

      if (!type) {
        return null
      }

      return (
        <div className="flex w-36 items-center">
          <span className="text-foreground bg-chip-ticket-type-bg border-chip-ticket-type-border rounded-md border px-3 py-1 text-xs font-semibold capitalize">
            {type.label}
          </span>
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => {
      const methodValue = row.getValue("method") as string | undefined
      if (!methodValue) {
        return <span className="text-muted-foreground italic">N/A</span>
      }

      const method = ticketMethod.find(m => m.value === methodValue)
      if (!method) {
        return (
          <span className="text-muted-foreground italic">{methodValue}</span>
        )
      }

      return (
        <div className="flex items-center gap-x-2">
          {method.icon && (
            <method.icon size={16} className="text-chip-default-gray" />
          )}
          <span className="text-chip-default-gray capitalize">
            {method.label}
          </span>
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: false,
    meta: { label: "Method", className: "" }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {format(row.getValue("createdAt"), "MMM d, yyyy  h:mm a")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: "actions",
    cell: TicketsTableRowActions,
    enableHiding: false
  }
]
