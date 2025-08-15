"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Session } from "../data/schema"
import { DataTableRowActions } from "./SessionsTableRowActions"
import { DataTableColumnHeader } from "@/components/layout/Table/DataTableColumnHeader"
import { cn } from "@/lib/utils"
import { SessionsViewActions } from "./SessionsViewActions"
import { SessionsSummaryAction } from "./SessionsSummaryAction"
import { Badge } from "@/components/ui/badge"
import { aiScoreSchema } from "../data/data"
import CountryFlag from "react-country-flag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import countryData from "@/lib/countryData.json"

export const columns: ColumnDef<Session>[] = [
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
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    // cell: ({ row }) => <span>{row.getValue("country")}</span>,
    cell: ({ getValue }) => {
      const value = getValue<string>()
      if (!value || value.toUpperCase() === "N/A") {
        return <span>N/A</span>
      }
      const code = value.toUpperCase()
      const getCountryName = (code: string) => {
        const country = countryData.find(c => c.code === code)
        return country ? country.name : code
      }
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
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => <SessionsViewActions row={row} />
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <span>{row.getValue("email")}</span>
  },
  {
    accessorKey: "aiScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AI Score" />
    ),
    cell: ({ row }) => {
      const { aiScore } = row.original
      const badgeColor = aiScoreSchema.get(aiScore)
      return (
        <div className="flex space-x-2">
          <Badge
            variant="ghost"
            className={cn(
              "px-2.5 py-0.5 text-xs font-semibold capitalize",
              badgeColor
            )}
          >
            {row.getValue("aiScore")}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: "intent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intent" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("intent")}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("duration")}
          </span>
        </div>
      )
    }
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // }
  },
  // {
  //   accessorKey: "chatSummary",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Chat Summary" />
  //   ),
  //   cell: ({ row }) => {
  //     const chatSummary = row.getValue("chatSummary")

  //     if (!chatSummary) {
  //       return null
  //     }

  //     return (
  //       <div className="flex space-x-2">
  //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
  //           {typeof chatSummary === "string" || typeof chatSummary === "number"
  //             ? chatSummary
  //             : ""}
  //         </span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   }
  // },
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("dateTime")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    id: "chatSummary",
    cell: SessionsSummaryAction
  },
  {
    id: "actions",
    cell: DataTableRowActions
  }
]
