"use client"

import { JSX, useEffect, useMemo, useState } from "react"
import { useApiMutation } from "@/query/hooks/useApiMutation"
import { Card } from "@/components/ui/card"
import { useApiQuery } from "@/query"
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

export default function LeadsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const projectId = useProjectId()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

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

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  const {
    data: paginatedData,
    isLoading: isLeadsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedResult<Lead>>(
    ["project-leads", projectId, currentPage, rowsPerPage, debouncedSearchTerm],
    `/leads?projectId=${
      projectId ?? 0
    }&page=${currentPage}&limit=${rowsPerPage}${debouncedSearchTerm ? `&searchTerm=${encodeURIComponent(debouncedSearchTerm)}` : ""}`,
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
            <div className="relative">
              <button className="flex items-center rounded-md border px-2 py-1 text-sm">
                Last 7 Days
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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
              <span className="text-sm">{dateRange}</span>
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

            <div className="h-7 w-0.5 bg-gray-500/50" />

            <div className="flex items-center space-x-2.5">
              <input
                type="text"
                placeholder="Search by user name or email..."
                className="rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                }}
              />

              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 dark:bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center rounded-md border px-2 py-1 text-sm">
                Country
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center rounded-md border px-2 py-1 text-sm">
                Scoring
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center rounded-md border px-2 py-1 text-sm">
                Duration
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="rounded-md border px-2 py-1 text-sm">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
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
              <thead className="bg-gray-50 text-left dark:bg-gray-900/75">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === leads.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-sm font-medium">User Name</th>
                  <th className="p-4 text-sm font-medium">Email</th>
                  <th className="p-4 text-sm font-medium">Number</th>
                  <th className="p-4 text-sm font-medium">Lead Score</th>
                  <th className="p-4 text-sm font-medium">Status</th>
                  <th className="p-4 text-sm font-medium">Date</th>
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
                      {formatDate(lead.timestamp)}
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
                        {formatDate(selectedLead.timestamp)}
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
