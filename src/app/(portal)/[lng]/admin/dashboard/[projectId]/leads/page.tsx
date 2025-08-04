"use client"

import { JSX, useEffect, useMemo, useState } from "react"
import { useApiMutation } from "@/query/hooks/useApiMutation"
import { Card } from "@/components/ui/card"
import { useApiQuery } from "@/query"
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import RefreshIcon from "@/../public/assets/icons/refresh-icon.svg"
import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import NoDataIcon from "@/../public/assets/icons/no-data-icon.svg"
import { useProjectId } from "@/lib/hooks/useProjectId"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { LeadScoreType, type Lead } from "@/models/lead"
import { type PaginatedResult } from "@/types/paginatedData"
import { formatDate } from "@/utils/formatDate"
import {
  leadScoreOptions,
  leadStatusOptions,
  dateRangeOptions,
  type LeadScoreType as FilterLeadScoreType,
  type LeadStatusType,
  type DateRangeType
} from "@/models/filterOptions"

export default function LeadsPage(): JSX.Element {
  interface LeadFilters {
    searchTerm: string
    score: string
    status: string
    startDate: string
    endDate: string
  }

  function buildQueryString(filters: LeadFilters): string {
    const params = [
      `searchTerm=${encodeURIComponent(filters.searchTerm || "")}`,
      `score=${encodeURIComponent(filters.score || "")}`,
      `status=${encodeURIComponent(filters.status || "")}`,
      `startDate=${encodeURIComponent(filters.startDate || "")}`,
      `endDate=${encodeURIComponent(filters.endDate || "")}`
    ]
    return params.join("&")
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedScore, setSelectedScore] = useState<FilterLeadScoreType>("")
  const [selectedStatus, setSelectedStatus] = useState<LeadStatusType>("")

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Date range functionality
  const todayInit = new Date()
  const startInit = new Date(todayInit)
  startInit.setDate(todayInit.getDate() - 6)
  const [startDate, setStartDate] = useState(() =>
    startInit.toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState(() =>
    todayInit.toISOString().slice(0, 10)
  )
  const [selectedDateRangeType, setSelectedDateRangeType] =
    useState<DateRangeType>("last7")

  const projectId = useProjectId()

  // Helper to format date as yyyy-mm-dd
  const formatDateISO = (d: Date): string => {
    return d.toISOString().slice(0, 10)
  }

  const getFormattedDateRange = (): string => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const format = (d: Date): string =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })

    return startDate === endDate
      ? format(start)
      : `${format(start)} - ${format(end)}`
  }

  const handleDateRangeChange = (value: DateRangeType): void => {
    setSelectedDateRangeType(value)

    const today = new Date()
    const daysMap: Record<DateRangeType, number> = {
      today: 0,
      yesterday: 1,
      last7: 6,
      last30: 29,
      last90: 89,
      "": 0
    }

    const offset = daysMap[value]
    const start = new Date(today)
    const end = new Date(today)

    if (value === "yesterday") {
      start.setDate(today.getDate() - 1)
      end.setDate(today.getDate() - 1)
    } else {
      start.setDate(today.getDate() - offset)
    }

    setStartDate(formatDateISO(start))
    setEndDate(formatDateISO(end))
  }

  const handleDateDropdownChange = (val: string): void => {
    handleDateRangeChange(val as DateRangeType)
  }

  const scoreMutation = useApiMutation(
    projectId ? `/leads/initiateScoreCalculation/${projectId}` : "",
    "post",
    {
      onSuccess: () => {
        void refetch()
      },
      onError: () => {
        void refetch()
      }
    }
  )

  useEffect(() => {
    if (!projectId) return
    scoreMutation.mutate(undefined)
  }, [projectId])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedScore, selectedStatus, startDate, endDate])

  const filters: LeadFilters = {
    searchTerm: debouncedSearchTerm,
    score: selectedScore,
    status: selectedStatus,
    startDate,
    endDate
  }

  const queryString =
    `/leads?projectId=${projectId ?? 0}` +
    `&page=${currentPage}` +
    `&limit=${rowsPerPage}` +
    `&${buildQueryString(filters)}`

  const {
    data: paginatedData,
    isLoading: isLeadsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedResult<Lead>>(
    [
      "project-leads",
      projectId,
      currentPage,
      rowsPerPage,
      debouncedSearchTerm,
      selectedScore,
      selectedStatus,
      startDate,
      endDate
    ],
    queryString,
    () => ({ method: "get" })
  )

  const leads = useMemo((): Lead[] => {
    if (!paginatedData?.data) return []
    return paginatedData.data
  }, [paginatedData])

  const totalPages = paginatedData?.total
    ? Math.ceil(paginatedData.total / rowsPerPage)
    : 1

  const handleRowClick = (leadId: string | number) => () => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
      setIsModalOpen(true)
    }
  }

  // Toggle row selection
  const toggleRowSelection = (id: string) => () => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Toggle all rows selection
  const toggleAllRows = (): void => {
    if (selectedRows.length === leads.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(leads.map(lead => lead.id.toString()))
    }
  }

  const handleRowsPerPageChange =
    (e: React.ChangeEvent<HTMLSelectElement>) => () => {
      setRowsPerPage(Number(e.target.value))
      setCurrentPage(1)
    }

  const handleRowCheckboxChange = (id: string) => () => {
    toggleRowSelection(id)()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex w-max items-center space-x-2">
        <h1 className="text-2xl font-semibold">Leads</h1>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <div className="w-40">
              <SingleSelectDropdown
                options={dateRangeOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
                value={selectedDateRangeType}
                onChange={handleDateDropdownChange}
                placeholder="Date Range"
              />
            </div>

            <div className="flex items-center space-x-2 border-l pl-2">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">
                {getFormattedDateRange()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => {
                void refetch()
              }}
              disabled={isFetching}
              className="rounded-md border p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
              aria-label="Refresh data"
            >
              <RefreshIcon
                className={`h-5 w-5 fill-gray-500 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 dark:bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <input
                type="text"
                placeholder="Search by user name or email..."
                className="w-64 rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                }}
              />
            </div>

            <div className="w-32">
              <SingleSelectDropdown
                options={[...leadScoreOptions]}
                value={selectedScore}
                onChange={(value: string) =>
                  setSelectedScore(value as FilterLeadScoreType)
                }
                placeholder="Score"
              />
            </div>

            <div className="w-32">
              <SingleSelectDropdown
                options={[...leadStatusOptions]}
                value={selectedStatus}
                onChange={(value: string) =>
                  setSelectedStatus(value as LeadStatusType)
                }
                placeholder="Status"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex items-center rounded-md border px-3 py-2 text-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M13.3333 4.66699H7.33329M9.33329 11.3337H3.33329M9.33329 11.3337C9.33329 12.4382 10.2287 13.3337 11.3333 13.3337C12.4379 13.3337 13.3333 12.4382 13.3333 11.3337C13.3333 10.2291 12.4379 9.33366 11.3333 9.33366C10.2287 9.33366 9.33329 10.2291 9.33329 11.3337ZM6.66663 4.66699C6.66663 5.77156 5.7712 6.66699 4.66663 6.66699C3.56206 6.66699 2.66663 5.77156 2.66663 4.66699C2.66663 3.56242 3.56206 2.66699 4.66663 2.66699C5.7712 2.66699 6.66663 3.56242 6.66663 4.66699Z"
                  stroke="#0F172A"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              View
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLeadsLoading ? (
            <div className="flex h-96 w-full items-center justify-center">
              <LoadingIcon
                className={`h-40 w-40 fill-gray-500/50 font-thin ${
                  isLeadsLoading
                    ? "animate-infinite animate-ease-in-out animate-alternate-reverse animate-fill-both animate-pulse"
                    : ""
                }`}
              />
            </div>
          ) : leads.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 text-left dark:bg-gray-900/75">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === leads.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    User Name
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Phone Number
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Lead Score
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="w-8 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map(lead => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer align-middle hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleRowClick(lead.id)}
                  >
                    <td
                      className="p-4"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(lead.id.toString())}
                        onChange={() => {
                          handleRowCheckboxChange(lead.id.toString())
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 text-sm">{lead.userName}</td>
                    <td className="p-4 text-sm">{lead.email}</td>
                    <td className="p-4 text-sm text-green-600">
                      {lead.phoneNumber}
                    </td>
                    <td className="p-4 text-sm">
                      {scoreMutation && scoreMutation.status === "pending" ? (
                        <div className="h-4 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      ) : typeof lead.score !== "undefined" ? (
                        <span
                          className={
                            lead.score === LeadScoreType.Cold
                              ? "font-normal text-blue-500"
                              : lead.score === LeadScoreType.Warm
                                ? "font-normal text-orange-500"
                                : lead.score === LeadScoreType.Hot
                                  ? "font-normal text-red-600"
                                  : "font-normal text-yellow-600"
                          }
                        >
                          {lead.score?.replace(" Lead", "")}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-4 text-sm">new</td>
                    <td className="p-4 text-sm">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-96 w-full flex-col items-center justify-center">
              <NoDataIcon className="h-40 w-40 fill-gray-500/50" />
              <p className="text-lg text-gray-500/75">No chats available</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            {selectedRows.length > 0
              ? `${selectedRows.length} of ${
                  paginatedData?.total ?? 0
                } row(s) selected.`
              : `0 of ${paginatedData?.total ?? 0} row(s) selected.`}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

            <div className="ml-4 flex items-center space-x-2">
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>

              <div className="">
                <button
                  className={`rounded p-1 ${
                    currentPage === 1
                      ? "cursor-not-allowed hover:bg-gray-100/25 dark:hover:bg-gray-700/25"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1))
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  className={`rounded p-1 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed hover:bg-gray-100/25 dark:hover:bg-gray-700/25"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* <button
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(totalPages)
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button> */}
            </div>
          </div>
        </div>

        {/* Ticket Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg
                    className="h-3 w-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Ticket Details
              </DialogTitle>
            </DialogHeader>

            {selectedLead && (
              <>
                <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        User Name
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedLead.userName}
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Email
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedLead.email}
                      </p>
                    </div>

                    {/* You may not have status in ChatConversation, so show N/A or add logic if available */}
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Number
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-600">
                          {selectedLead.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Lead Score
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-yellow-600">
                          {selectedLead.score?.replace(" Lead", "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Status
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        N/A
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Date
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDate(selectedLead.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex min-h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Content
                  </span>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLead.content}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
