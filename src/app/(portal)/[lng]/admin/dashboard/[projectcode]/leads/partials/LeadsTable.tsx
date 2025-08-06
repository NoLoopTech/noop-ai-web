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
import { DataTableToolbar } from "./LeadsTableToolbar"
import { Lead } from "../data/schema"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery } from "@/query"
import { PaginatedResult } from "@/types/paginatedData"

interface Props {
  columns: ColumnDef<Lead>[]
  data: Lead[]
}

export function LeadsTable({ columns, data }: Props) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const projectId = useProjectCode()

  // const { data: paginatedData, isLoading: isLeadsLoading } = useApiQuery<
  //   PaginatedResult<Lead>
  // >(
  //   ["project-leads", projectId, currentPage, rowsPerPage],
  //   `/leads?projectId=${
  //     projectId ?? 0
  //   }&page=${currentPage}&limit=${rowsPerPage}`,
  //   () => ({
  //     method: "get"
  //   })
  // )

  const filterParams = useMemo(() => {
    const params: Record<string, string> = {}
    columnFilters.forEach(f => {
      if (!f.value || (typeof f.value === "object" && !Array.isArray(f.value)))
        return
      if (f.id === "userName") params.searchTerm = String(f.value)
      // if (f.id === "startDate") params.startDate = String(f.value)
      // if (f.id === "endDate") params.endDate = String(f.value)
      if (f.id === "score")
        params.score = Array.isArray(f.value)
          ? f.value.join(",")
          : String(f.value)
      if (f.id === "status")
        params.status = Array.isArray(f.value)
          ? f.value.join(",")
          : String(f.value)
    })
    return params
  }, [columnFilters])

  // Build API query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      projectId: String(projectId ?? 0),
      page: String(currentPage),
      limit: String(rowsPerPage),
      ...filterParams
    })
    return `/leads?${params.toString()}`
  }, [projectId, currentPage, rowsPerPage, filterParams])

  const { data: paginatedData, isLoading: isLeadsLoading } = useApiQuery<
    PaginatedResult<Lead>
  >(
    ["project-leads", projectId, currentPage, rowsPerPage, filterParams],
    queryString,
    () => ({
      method: "get"
    })
  )

  const leads = useMemo((): Lead[] => {
    if (!paginatedData?.data) return []
    // if (searchTerm) {
    //   return paginatedData.data.filter(
    //     lead =>
    //       lead.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       lead.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    //   )
    // }
    return paginatedData.data
  }, [paginatedData])

  const combinedLeads = useMemo(() => {
    const minLength = Math.min(leads.length, data.length)
    return Array.from({ length: minLength }, (_, i) => ({
      id: leads[i].id,
      userName: leads[i].userName,
      email: leads[i].email,
      phoneNumber: leads[i].phoneNumber,
      createdAt: leads[i].createdAt,
      preference: leads[i].preference,
      score: leads[i].score,
      status: data[i].status
    }))
  }, [leads, data])

  const table = useReactTable({
    data: combinedLeads,
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
    pageCount: paginatedData?.total
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
      <DataTableToolbar table={table} />
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
                      {isLeadsLoading ? (
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
            ) : isLeadsLoading ? (
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
