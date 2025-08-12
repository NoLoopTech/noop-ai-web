"use client"

import { useMemo, useState } from "react"
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
import { DataTableToolbar } from "./TicketsTableToolbar"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery } from "@/query"
import { PaginatedResult } from "@/types/paginatedData"
import { Ticket } from "../data/schema"
import { DateRangeType } from "@/models/filterOptions"
import { useDebounce } from "@/lib/hooks/useDebounce"

interface Props {
  columns: ColumnDef<Ticket>[]
  // data: Ticket[]
}

export function TicketsTable({ columns }: Props) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    country: false,
    content: false
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Server-side filters state
  const [filters, setFilters] = useState<{
    searchTerm: string
    startDate: string
    endDate: string
    dateRangeType: DateRangeType
  }>({
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateRangeType: "today"
  })

  // Debounce the search term for server-side filtering
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500)

  const projectId = useProjectCode()

  const { data: paginatedData, isLoading: isTicketsLoading } = useApiQuery<
    PaginatedResult<Ticket>
  >(
    [
      "project-tickets",
      projectId,
      currentPage,
      rowsPerPage,
      debouncedSearchTerm,
      filters.startDate,
      filters.endDate
    ],
    `/tickets?projectId=${
      projectId ?? 4
    }&page=${currentPage}&limit=${rowsPerPage}` +
      (debouncedSearchTerm ? `&searchTerm=${debouncedSearchTerm}` : "") +
      (filters.startDate ? `&startDate=${filters.startDate}` : "") +
      (filters.endDate ? `&endDate=${filters.endDate}` : ""),
    () => ({
      method: "get"
    })
  )

  const tickets = useMemo((): Ticket[] => {
    if (!paginatedData?.data) return []
    return paginatedData.data.map(ticket => ({
      ...ticket,
      status: ticket.status ?? "active",
      priority: ticket.priority ?? "medium",
      type: ticket.type ?? "information-request",
      method: ticket.method ?? "automated"
    }))
  }, [paginatedData])

  // const combinedTickets = useMemo(() => {
  //   const minLength = Math.min(tickets.length, data.length)
  //   return Array.from({ length: minLength }, (_, i) => ({
  //     id: tickets[i].id,
  //     userName: tickets[i].userName,
  //     email: tickets[i].email,
  //     status: data[i]?.status || "open",
  //     priority: data[i]?.priority || "medium",
  //     type: data[i]?.type || "bug",
  //     createdAt: tickets[i].createdAt
  //   }))
  // }, [tickets, data])

  const table = useReactTable({
    data: tickets,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1, // 0-based index
        pageSize: rowsPerPage
      }
    },
    enableRowSelection: true,
    manualPagination: true,
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
      <DataTableToolbar
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
                      className="align-middle"
                      colSpan={header.colSpan}
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
                      {isTicketsLoading ? (
                        <div className="shine h-8 w-full rounded-lg"></div>
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
            ) : isTicketsLoading ? (
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
