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
import { DataTableToolbar } from "./LeadsTableToolbar"
import { Lead } from "../data/schema"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery, useApiMutation } from "@/query"
import { PaginatedResult } from "@/types/paginatedData"
import { useToast } from "@/lib/hooks/useToast"
import { DateRangeType } from "@/models/filterOptions"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { useSession } from "next-auth/react"
import { IconLoader2 } from "@tabler/icons-react"
import { LeadsTableRowActions } from "./LeadsTableRowActions"
import { cleanStrings } from "@/utils"

interface Props {
  columns: ColumnDef<Lead>[]
}

export function LeadsTable({ columns }: Props) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableLoading, setTableLoading] = useState(false)

  // Server-side filters state (minimal addition)
  const [filters, setFilters] = useState<{
    searchTerm: string
    startDate: string
    endDate: string
    dateRangeType: DateRangeType
  }>({
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateRangeType: ""
  })

  // Debounce the search term for server-side filtering
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500)

  const projectId = useProjectCode()
  const { toast } = useToast()

  const { data: session, status } = useSession()
  const token = session?.apiToken
  const firedRef = useRef(false)

  // Lead score calculation mutation
  const scoreMutation = useApiMutation(
    projectId ? `/leads/initiateScoreCalculation/${projectId}` : "",
    "post",
    {
      onSuccess: () => {},
      onError: error => {
        if (status !== "authenticated" || !token) return
        const errorMessage =
          (error as { message?: string })?.message ||
          "Failed to calculate lead scores. Please try again."
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

  const filterParams = useMemo(() => {
    const params: Record<string, string> = {}

    if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm

    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate

    columnFilters.forEach(f => {
      if (!f.value || (typeof f.value === "object" && !Array.isArray(f.value)))
        return
      if (f.id === "score")
        params.score = Array.isArray(f.value)
          ? f.value
              .map(v => String(v).charAt(0).toUpperCase() + String(v).slice(1))
              .join(",")
          : String(f.value).charAt(0).toUpperCase() + String(f.value).slice(1)
      if (f.id === "status")
        params.status = Array.isArray(f.value)
          ? f.value.join(",")
          : String(f.value)
    })
    return params
  }, [columnFilters, debouncedSearchTerm, filters.startDate, filters.endDate])

  // INFO: Build API query string
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

  function normalizeScore(
    score: string | null | undefined
  ): "hot" | "warm" | "cold" {
    if (!score) return "cold"

    const cleaned = score
      .replace(/ *lead/i, "")
      .trim()
      .toLowerCase()
    if (cleaned === "hot" || cleaned === "warm" || cleaned === "cold") {
      return cleaned as "hot" | "warm" | "cold"
    }
    return "cold"
  }

  const leads = useMemo((): Lead[] => {
    if (!paginatedData?.data) return []

    return paginatedData.data.map(lead => ({
      ...lead,
      preference: cleanStrings(lead.preference?.toString()),
      score: normalizeScore(lead.score),
      status: lead.status ?? "new"
    }))
  }, [paginatedData])

  const table = useReactTable({
    data: leads,
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
      <DataTableToolbar
        table={table}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="relative rounded-md border">
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
                      ) : cell.column.id === "actions" ? (
                        <LeadsTableRowActions
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
