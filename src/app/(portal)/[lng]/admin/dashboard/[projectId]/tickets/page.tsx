"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
// import { useApiQuery } from "@/query"
// import { type PaginatedChats } from "@/models/conversation"
// import RefreshIcon from "@/../public/assets/icons/refresh-icon.svg"
import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import NoDataIcon from "@/../public/assets/icons/no-data-icon.svg"
import TimerIcon from "@/../public/assets/icons/timer.svg"
import DoneIcon from "@/../public/assets/icons/done.svg"
import TodoIcon from "@/../public/assets/icons/todo.svg"
import ClosedIcon from "@/../public/assets/icons/closed.svg"
import ArrowUpIcon from "@/../public/assets/icons/arrow-up.svg"
import ArrowDownIcon from "@/../public/assets/icons/arrow-down.svg"
import ArrowRightIcon from "@/../public/assets/icons/arrow-right.svg"
// import { useProjectId } from "@/lib/hooks/useProjectId"

// Mock data for tickets
const MOCK_TICKETS = [
  {
    id: 1,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "High",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 2,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 3,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "Medium",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 4,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "Done",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 5,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "Todo",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 6,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 7,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 8,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "Closed",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 9,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "Closed",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  },
  {
    id: 10,
    ticketId: "#1234",
    userName: "William Kim",
    email: "example@gmail.com",
    status: "In progress",
    priority: "Low",
    type: "Sales Bot",
    createdOn: "April 10, 2025"
  }
]

export default function ChatsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("Status")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<
    (typeof MOCK_TICKETS)[0] | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatsLoading] = useState(false)

  //   const projectId = useProjectId()

  //   const {
  //     isLoading: isChatsLoading,
  //     isFetching,
  //     refetch
  //   } = useApiQuery<PaginatedChats>(
  //     ["project-conversations", projectId, currentPage, rowsPerPage, searchTerm],
  //     `/conversation/project-conversations?projectId=${
  //       projectId ?? 0
  //     }&page=${currentPage}&limit=${rowsPerPage}&search=${searchTerm}`,
  //     () => ({
  //       method: "get"
  //     })
  //   )

  const totalPages = Math.ceil(MOCK_TICKETS.length / rowsPerPage)

  // Get current page tickets
  const currentPageTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return MOCK_TICKETS.slice(startIndex, endIndex)
  }, [currentPage, rowsPerPage])

  const handleRowClick = (ticketId: string): void => {
    const ticket = MOCK_TICKETS.find(t => t.id.toString() === ticketId)
    if (ticket) {
      setSelectedTicket(ticket)
      setIsModalOpen(true)
    }
  }

  // Toggle row selection
  const toggleRowSelection = (id: string): void => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Toggle all rows selection
  const toggleAllRows = (): void => {
    if (selectedRows.length === MOCK_TICKETS.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(MOCK_TICKETS.map(ticket => ticket.id.toString()))
    }
  }

  const handleRowCheckboxChange = (id: string) => () => {
    toggleRowSelection(id)
  }

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="w-max flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">Tickets</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="flex items-center border rounded-md px-2 py-1 text-sm">
                Last 7 Days
                <svg
                  className="w-4 h-4 ml-1"
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

            <div className="flex items-center space-x-2 pl-2 border-l">
              <svg
                className="w-5 h-5 text-gray-500"
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
            {/* <button
              onClick={() => {
                void refetch()
              }}
              disabled={isFetching}
              className="p-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshIcon
                className={`w-5 h-5 fill-gray-500 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
            </button> */}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-2.5 flex-1 mr-4">
            <input
              type="text"
              placeholder="Search by user name..."
              className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
              }}
            />

            <svg
              className="w-5 h-5 text-gray-500"
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
                className="flex items-center border rounded-md px-2 py-1 text-sm"
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen)
                }}
              >
                {statusFilter}
                <svg
                  className="w-4 h-4 ml-1"
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
                <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {["In progress", "Done", "Todo", "Closed"].map(status => (
                    <button
                      key={status}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <button className="flex items-center border rounded-md px-2 py-1 text-sm">
                Source
                <svg
                  className="w-4 h-4 ml-1"
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
          {isChatsLoading ? (
            <div className="w-full h-96 flex justify-center items-center">
              <LoadingIcon
                className={`w-40 h-40 font-thin fill-gray-500/50 ${
                  isChatsLoading
                    ? "animate-pulse animate-infinite animate-ease-in-out animate-alternate-reverse animate-fill-both"
                    : ""
                }`}
              />
            </div>
          ) : currentPageTickets.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-900/75 text-left">
                <tr>
                  <th className="p-4 w-8">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === MOCK_TICKETS.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 w-5 text-sm font-medium text-gray-500">
                    Ticket ID
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    User Name
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Email
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
                  <th className="p-4 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentPageTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 align-middle cursor-pointer"
                    onClick={() => {
                      handleRowClick(ticket.id.toString())
                    }}
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
                        onChange={() => {
                          handleRowCheckboxChange(ticket.id.toString())
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {ticket.ticketId}
                    </td>
                    <td className="p-4 text-sm">{ticket.userName}</td>
                    <td className="p-4 text-sm">{ticket.email}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {ticket.status === "Done" ? (
                          <DoneIcon className="w-4 h-4 text-green-600" />
                        ) : ticket.status === "Todo" ? (
                          <TodoIcon className="w-4 h-4 text-yellow-600" />
                        ) : ticket.status === "Closed" ? (
                          <ClosedIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <TimerIcon className="w-4 h-4 text-blue-600" />
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
                          {ticket.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {ticket.priority === "High" ? (
                          <ArrowUpIcon className="w-4 h-4 text-gray-500" />
                        ) : ticket.priority === "Medium" ? (
                          <ArrowRightIcon className="w-4 h-4 text-gray-500" />
                        ) : ticket.priority === "Low" ? (
                          <ArrowDownIcon className="w-4 h-4 text-gray-500" />
                        ) : null}
                        <span className="text-gray-500">{ticket.priority}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{ticket.type}</td>
                    <td className="p-4 text-sm">{ticket.createdOn}</td>
                    <td className="p-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          className="w-5 h-5"
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
            <div className="w-full h-96 flex flex-col justify-center items-center">
              <NoDataIcon className="w-40 h-40 fill-gray-500/50" />
              <p className="text-lg text-gray-500/75">No tickets available</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedRows.length > 0
              ? `${selectedRows.length} of ${MOCK_TICKETS.length} row(s) selected.`
              : `0 of ${MOCK_TICKETS.length} row(s) selected.`}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

            <div className="flex items-center space-x-2 ml-4">
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>

              <div className="">
                <button
                  className={`p-1 rounded ${
                    currentPage === 1
                      ? "hover:bg-gray-100/25 dark:hover:bg-gray-700/25 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1))
                  }}
                >
                  <svg
                    className="w-5 h-5"
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
                  className={`p-1 rounded ${
                    currentPage === totalPages
                      ? "hover:bg-gray-100/25 dark:hover:bg-gray-700/25 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }}
                >
                  <svg
                    className="w-5 h-5"
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
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-blue-600 dark:text-blue-400"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Ticket ID
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedTicket.ticketId}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      User Name
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedTicket.userName}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Email
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedTicket.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Status
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedTicket.status === "Done" ? (
                        <DoneIcon className="w-4 h-4 text-green-600" />
                      ) : selectedTicket.status === "Todo" ? (
                        <TodoIcon className="w-4 h-4 text-yellow-600" />
                      ) : selectedTicket.status === "Closed" ? (
                        <ClosedIcon className="w-4 h-4 text-gray-600" />
                      ) : (
                        <TimerIcon className="w-4 h-4 text-blue-600" />
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
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Priority
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedTicket.priority === "High" ? (
                        <ArrowUpIcon className="w-4 h-4 text-red-500" />
                      ) : selectedTicket.priority === "Medium" ? (
                        <ArrowRightIcon className="w-4 h-4 text-yellow-500" />
                      ) : selectedTicket.priority === "Low" ? (
                        <ArrowDownIcon className="w-4 h-4 text-green-500" />
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
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Type
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedTicket.type}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Created On
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedTicket.createdOn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
