"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/layout/Table/DataTableColumnHeader"
import LeadsTableRowActions from "./LeadsTableRowActions"
import { Lead } from "../data/schema"
import { leadPreference, leadScore, leadStatus } from "../data/data"
import { LeadsRowInfoAction } from "./LeadsRowInfoAction"

export const columns: ColumnDef<Lead>[] = [
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
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="w-36 pl-3.5"
        title="User Name"
      />
    ),
    id: "userName",
    cell: LeadsRowInfoAction,
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
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    enableSorting: false,
    meta: { label: "Number", className: "" }
  },
  {
    accessorKey: "preference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preference" />
    ),
    cell: ({ row }) => {
      const { preference } = row.original
      const prefsArr = Array.isArray(preference) ? preference : []
      const visiblePrefs = prefsArr.slice(0, 2)
      const hiddenCount = prefsArr.length - visiblePrefs.length

      return (
        <div className="flex space-x-2">
          {visiblePrefs.map((pref: string, idx: number) => (
            <Badge
              key={idx}
              variant="ghost"
              className={cn(
                "min-w-max capitalize",
                leadPreference.get("visible-preference")
              )}
            >
              {pref}
            </Badge>
          ))}
          {hiddenCount > 0 && (
            <Badge
              variant="ghost"
              className={cn("-ml-2", leadPreference.get("hidden-preference"))}
            >
              {hiddenCount}+
            </Badge>
          )}
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="pl-2.5" title="Score" />
    ),
    cell: ({ row }) => {
      const { score } = row.original
      const badgeColor = leadScore.get(score)
      return (
        <div className="flex space-x-2">
          <Badge variant="ghost" className={cn("capitalize", badgeColor)}>
            {row.getValue("score")}
          </Badge>
        </div>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const leadObj = leadStatus.find(({ value }) => value === status)

      if (!leadObj) {
        return null
      }

      return (
        <div className="flex items-center gap-x-2">
          {leadObj.icon && (
            <leadObj.icon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm capitalize">{row.getValue("status")}</span>
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId))
      }
      return row.getValue(columnId) === filterValue
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
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
    cell: LeadsTableRowActions,
    enableHiding: false
  }
]
