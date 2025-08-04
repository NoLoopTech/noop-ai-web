"use client"

import { JSX, useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import NoDataIcon from "@/../public/assets/icons/no-data-icon.svg"
import TimerIcon from "@/../public/assets/icons/timer.svg"
import DoneIcon from "@/../public/assets/icons/done.svg"
import TodoIcon from "@/../public/assets/icons/todo.svg"
import ClosedIcon from "@/../public/assets/icons/closed.svg"
import ArrowUpIcon from "@/../public/assets/icons/arrow-up.svg"
import ArrowDownIcon from "@/../public/assets/icons/arrow-down.svg"
import ArrowRightIcon from "@/../public/assets/icons/arrow-right.svg"
import { useProjectId } from "@/lib/hooks/useProjectId"
import RefreshIcon from "@/../public/assets/icons/refresh-icon.svg"
import { useApiQuery } from "@/query"
import { type PaginatedResult } from "@/types/paginatedData"
import { type Ticket } from "@/models/ticket"
import { formatDate } from "@/utils/formatDate"

export default function ChatsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("Status")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const projectId = useProjectId()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when search changes
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  const {
    data: paginatedData,
    isLoading: isTicketsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedResult<Ticket>>(
    [
      "project-tickets",
      projectId,
      currentPage,
      rowsPerPage,
      debouncedSearchTerm
    ],
    `/tickets?projectId=${
      projectId ?? 0
    }&page=${currentPage}&limit=${rowsPerPage}${debouncedSearchTerm ? `&searchTerm=${encodeURIComponent(debouncedSearchTerm)}` : ""}`,
    () => ({
      method: "get"
    })
  )

  const tickets = useMemo((): Ticket[] => {
    if (!paginatedData?.data) return []
    return paginatedData.data
  }, [paginatedData])

  const totalPages = paginatedData?.total
    ? Math.ceil(paginatedData.total / rowsPerPage)
    : 1

  const handleRowClick = (ticketId: string) => () => {
    const ticket = tickets.find(t => t.id.toString() === ticketId)
    if (ticket) {
      setSelectedTicket(ticket)
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
    if (selectedRows.length === tickets.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(tickets.map(ticket => ticket.id.toString()))
    }
  }

  const handleRowCheckboxChange = (id: string) => () => {
    toggleRowSelection(id)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex w-max items-center space-x-2">
        <h1 className="text-2xl font-semibold">Tickets</h1>
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
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 dark:bg-gray-900/50">
          <div className="mr-4 flex flex-1 items-center space-x-2.5">
            <input
              type="text"
              placeholder="Search by user name or email..."
              className="flex-1 rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center rounded-md border px-2 py-1 text-sm"
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen)
                }}
              >
                {statusFilter}
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

              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 w-36 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {["In progress", "Done", "Todo", "Closed"].map(status => (
                    <button
                      key={status}
                      className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setStatusFilter(status)
                        setIsStatusDropdownOpen(false)
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button className="flex items-center rounded-md border px-2 py-1 text-sm">
                Source
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
        </div>

        <div className="overflow-x-auto">
          {isTicketsLoading ? (
            <div className="flex h-96 w-full items-center justify-center">
              <LoadingIcon
                className={`h-40 w-40 fill-gray-500/50 font-thin ${
                  isTicketsLoading
                    ? "animate-infinite animate-ease-in-out animate-alternate-reverse animate-fill-both animate-pulse"
                    : ""
                }`}
              />
            </div>
          ) : tickets.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 text-left dark:bg-gray-900/75">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tickets.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="px-1 py-4 text-sm font-medium text-gray-500">
                    Ticket ID
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
                    Status
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Priority
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Created On
                  </th>
                  <th className="w-8 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer align-middle hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleRowClick(ticket.id.toString())}
                  >
                    <td
                      className="p-4"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(ticket.id.toString())}
                        onChange={handleRowCheckboxChange(ticket.id.toString())}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 text-sm font-medium">{ticket.id}</td>
                    <td className="p-4 text-sm">{ticket.userName}</td>
                    <td className="p-4 text-sm">{ticket.email}</td>
                    <td className="p-4 text-sm">{ticket.phoneNumber}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {ticket.status === "Done" ? (
                          <DoneIcon className="h-4 w-4 text-green-600" />
                        ) : ticket.status === "Todo" ? (
                          <TodoIcon className="h-4 w-4 text-yellow-600" />
                        ) : ticket.status === "Closed" ? (
                          <ClosedIcon className="h-4 w-4 text-gray-600" />
                        ) : (
                          <TimerIcon className="h-4 w-4 text-blue-600" />
                        )}
                        <span
                          className={`${
                            ticket.status === "Done"
                              ? "text-green-500"
                              : ticket.status === "In progress"
                                ? "text-blue-500"
                                : ticket.status === "Todo"
                                  ? "text-yellow-500"
                                  : ticket.status === "Closed"
                                    ? "text-gray-500"
                                    : "text-gray-500"
                          }`}
                        >
                          {ticket.status ?? "New"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {ticket.priority === "High" ? (
                          <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                        ) : ticket.priority === "Medium" ? (
                          <ArrowRightIcon className="h-4 w-4 text-gray-500" />
                        ) : ticket.priority === "Low" ? (
                          <ArrowDownIcon className="h-4 w-4 text-gray-500" />
                        ) : null}
                        <span className="text-gray-500">
                          {ticket.priority ?? "medium"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{ticket.type ?? "General"}</td>
                    <td className="p-4 text-sm">
                      {formatDate(ticket.timestamp)}
                    </td>
                    <td className="p-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-96 w-full flex-col items-center justify-center">
              <NoDataIcon className="h-40 w-40 fill-gray-500/50" />
              <p className="text-lg text-gray-500/75">No tickets available</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            {selectedRows.length > 0
              ? `${selectedRows.length} of ${tickets.length} row(s) selected.`
              : `0 of ${tickets.length} row(s) selected.`}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
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

            {selectedTicket && (
              <>
                <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Ticket ID
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.id}
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        User Name
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.userName}
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Email
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.email}
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Phone Number
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.phoneNumber ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Status
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedTicket.status === "Done" ? (
                          <DoneIcon className="h-4 w-4 text-green-600" />
                        ) : selectedTicket.status === "Todo" ? (
                          <TodoIcon className="h-4 w-4 text-yellow-600" />
                        ) : selectedTicket.status === "Closed" ? (
                          <ClosedIcon className="h-4 w-4 text-gray-600" />
                        ) : (
                          <TimerIcon className="h-4 w-4 text-blue-600" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            selectedTicket.status === "Done"
                              ? "text-green-600"
                              : selectedTicket.status === "In progress"
                                ? "text-blue-600"
                                : selectedTicket.status === "Todo"
                                  ? "text-yellow-600"
                                  : selectedTicket.status === "Closed"
                                    ? "text-gray-600"
                                    : "text-gray-600"
                          }`}
                        >
                          {selectedTicket.status ?? "New"}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Priority
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedTicket.priority === "High" ? (
                          <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        ) : selectedTicket.priority === "Medium" ? (
                          <ArrowRightIcon className="h-4 w-4 text-yellow-500" />
                        ) : selectedTicket.priority === "Low" ? (
                          <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        ) : null}
                        <span
                          className={`text-sm font-semibold ${
                            selectedTicket.priority === "High"
                              ? "text-red-600"
                              : selectedTicket.priority === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {selectedTicket.priority ?? "medium"}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Type
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedTicket.type ?? "General"}
                      </p>
                    </div>

                    <div className="flex h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Created On
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDate(selectedTicket.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex min-h-16 flex-col justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Content
                  </span>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.content}
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
