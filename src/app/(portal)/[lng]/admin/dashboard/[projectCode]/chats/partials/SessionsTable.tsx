"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/layout/Table/DataTablePagination"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery, useApiMutation } from "@/query"
import { PaginatedResult } from "@/types/paginatedData"
import { ChatSessionResponse } from "@/models/conversation"
import { SessionsTableToolbar } from "./SessionsTableToolbar"
import { DateRangeType } from "@/models/filterOptions"
import { AiScore, Session } from "../data/schema"
import { format } from "date-fns"
import { useToast } from "@/lib/hooks/useToast"
import { useSession } from "next-auth/react"
import { DataTableRowActions } from "./SessionsTableRowActions"
import { IconLoader2 } from "@tabler/icons-react"

interface Props {
  columns: ColumnDef<Session>[]
  // data: Session[]
}

export function SessionsTable({ columns }: Props) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableLoading, setTableLoading] = useState(false)

  const [filters, setFilters] = useState<{
    username: string
    country: string
    scoring: string[]
    intent: string
    duration: string
    startDate: string
    endDate: string
    dateRangeType: DateRangeType
  }>({
    username: "",
    country: "",
    scoring: [],
    intent: "",
    duration: "",
    startDate: "",
    endDate: "",
    dateRangeType: ""
  })

  // useEffect(() => {
  //   const durationFilter = columnFilters.find(f => f.id === "duration")
  //   setFilters(prev => ({
  //     ...prev,
  //     duration: (durationFilter?.value as string) ?? ""
  //   }))
  // }, [columnFilters])

  useEffect(() => {
    const usernameFilter = columnFilters.find(f => f.id === "userName")
    const countryFilter = columnFilters.find(f => f.id === "country")
    const intentFilter = columnFilters.find(f => f.id === "intent")
    const durationFilter = columnFilters.find(f => f.id === "duration")

    setFilters(prev => ({
      ...prev,
      username: (usernameFilter?.value as string) ?? "",
      country: (countryFilter?.value as string) ?? "",
      intent: (intentFilter?.value as string) ?? "",
      duration: (durationFilter?.value as string) ?? ""
    }))
  }, [columnFilters])

  const projectId = useProjectCode()

  // Extract server-side filters from column filters (only for aiScore now)
  const serverFilters = useMemo(() => {
    const aiScoreColumn = columnFilters.find(filter => filter.id === "aiScore")
    const countryColumn = columnFilters.find(filter => filter.id === "country")

    const aiScoreValues = aiScoreColumn?.value
      ? Array.isArray(aiScoreColumn.value)
        ? aiScoreColumn.value
        : [aiScoreColumn.value]
      : []

    const countryValues = countryColumn?.value
      ? Array.isArray(countryColumn.value)
        ? countryColumn.value
        : [countryColumn.value]
      : []

    return {
      aiScore: aiScoreValues,
      country: countryValues
    }
  }, [columnFilters])

  // Session score calculation mutation

  const { toast } = useToast()

  const { data: session, status } = useSession()
  const token = session?.apiToken
  const firedRef = useRef(false)

  const scoreMutation = useApiMutation(
    projectId
      ? `/conversations/initiateSessionScoreCalculation/${projectId}`
      : "",
    "post",
    {
      onSuccess: () => {},
      onError: error => {
        if (status !== "authenticated" || !token) return
        const errorMessage =
          (error as { message?: string })?.message ||
          "Failed to calculate session scores. Please try again."
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    }
  )

  useEffect(() => {
    if (!projectId) return
    if (status !== "authenticated" || !token) return
    if (firedRef.current) return

    firedRef.current = true
    scoreMutation.mutate(undefined)
  }, [projectId, status, token])
  // TODO: Use this scoreMutation to trigger score calculation

  const { data: paginatedData, isLoading: isChatsLoading } = useApiQuery<
    PaginatedResult<ChatSessionResponse>
  >(
    [
      "chat-sessions",
      projectId,
      currentPage,
      rowsPerPage,
      filters.username,
      serverFilters.country.join(","),
      serverFilters.aiScore.join(","),
      filters.intent,
      filters.duration,
      filters.startDate,
      filters.endDate
    ],
    `/conversations?projectId=${projectId ?? 4}&page=${currentPage}&limit=${rowsPerPage}&sortBy=createdAt&sortDir=DESC` +
      (filters.username ? `&username=${filters.username}` : "") +
      (serverFilters.country.length > 0
        ? `&country=${serverFilters.country.join(",")}`
        : "") +
      (serverFilters.aiScore.length > 0
        ? `&scoring=${serverFilters.aiScore.join(",")}`
        : "") +
      (filters.intent ? `&intent=${filters.intent}` : "") +
      (filters.duration ? `&duration=${filters.duration}` : "") +
      (filters.startDate ? `&startDate=${filters.startDate}` : "") +
      (filters.endDate ? `&endDate=${filters.endDate}` : ""),
    () => ({
      method: "get"
    })
  )

  const secondsToMinutes = (seconds: number): string => {
    if (seconds <= 60) {
      return "< 1min"
    }
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min${minutes > 1 ? "s" : ""}`
  }

  const chatSessions = useMemo(() => {
    if (!paginatedData?.data) return []
    return paginatedData.data.map(session => ({
      id: session.session.threadId,
      country: session.session.country ?? "N/A",
      aiScore: (session.session.score as AiScore) ?? "Normal",
      duration: secondsToMinutes(session.duration),
      chatSummary: session.session.summary,
      dateTime: format(session.session.createdAt, "MMM d, yyyy  h:mm a"),
      userName: session.session.userName ?? "Guest User",
      email: session.session.email ?? "Not Provided",
      intent: session.session.intent ?? "Not Determined",
      threadId: session.session.threadId
    }))
  }, [paginatedData])

  const table = useReactTable({
    data: chatSessions,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: rowsPerPage
      }
    },
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount:
      typeof paginatedData?.total === "number"
        ? Math.max(1, Math.ceil(paginatedData.total / rowsPerPage))
        : 1,
    onPaginationChange: updater => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize: rowsPerPage })
          : updater
      setCurrentPage(next.pageIndex + 1)
      setRowsPerPage(next.pageSize)
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  return (
    <div className="space-y-4">
      {/* <SessionsTableToolbar table={table} /> */}
      <SessionsTableToolbar
        table={table}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="align-middle"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {isChatsLoading ? (
                        <div className="shine h-8 w-full rounded-lg"></div>
                      ) : cell.column.id === "actions" ? (
                        <DataTableRowActions
                          row={row}
                          setTableLoading={setTableLoading}
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isChatsLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`skeleton-row-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-cell-${j}`}>
                      <div className="shine h-8 w-full rounded-sm"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {tableLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/2 backdrop-blur-sm">
            <IconLoader2 className="text-primary h-12 w-12 animate-spin" />
          </div>
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
