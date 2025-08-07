"use client"

import { useEffect, useMemo, useState } from "react"
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
import { formatDate } from "date-fns"
import { SessionsTableToolbar } from "./SessionsTableToolbar"
import { DateRangeType } from "@/models/filterOptions"
import { Session } from "../data/schema"
import { useToast } from "@/lib/hooks/useToast"

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
    dateRangeType: "today"
  })

  const projectId = useProjectCode()
  const { toast } = useToast()

  // Trigger session score calculation on page load
  useEffect(() => {
    if (!projectId) return
    scoreMutation.mutate(undefined)
  }, [projectId])

  // Extract server-side filters from column filters (only for aiScore now)
  const serverFilters = useMemo(() => {
    const aiScoreColumn = columnFilters.find(filter => filter.id === "aiScore")

    const aiScoreValues = aiScoreColumn?.value
      ? Array.isArray(aiScoreColumn.value)
        ? aiScoreColumn.value
        : [aiScoreColumn.value]
      : []

    return {
      aiScore: aiScoreValues
    }
  }, [columnFilters])

  // Session score calculation mutation
  const scoreMutation = useApiMutation(
    projectId
      ? `/conversations/initiateSessionScoreCalculation/${projectId}`
      : "",
    "post",
    {
      onSuccess: () => {
        void refetch()
      },
      onError: error => {
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

  const {
    data: paginatedData,
    isLoading: isChatsLoading,
    refetch
  } = useApiQuery<PaginatedResult<ChatSessionResponse>>(
    [
      "chat-sessions",
      projectId,
      currentPage,
      rowsPerPage,
      filters.username,
      filters.country,
      serverFilters.aiScore.join(","),
      filters.intent,
      filters.duration,
      filters.startDate,
      filters.endDate
    ],
    `/conversations?projectId=${projectId ?? 4}&page=${currentPage}&limit=${rowsPerPage}&sortBy=createdAt&sortDir=DESC` +
      (filters.username ? `&username=${filters.username}` : "") +
      (filters.country ? `&country=${filters.country}` : "") +
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
      aiScore: session.session.score,
      duration: secondsToMinutes(session.duration),
      chatSummary: session.session.summary,
      dateTime: formatDate(session.session.createdAt, "dd/MM/yyyy HH:mm:ss"),
      userName: "N/A",
      email: "N/A"
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
