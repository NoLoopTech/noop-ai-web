"use client"

import { useMemo, useState } from "react"
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
import { type Lead } from "@/models/lead"
import { type PaginatedResult } from "@/types/paginatedData"

type PaginatedLeads = PaginatedResult<Lead>

export default function ChatsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("history")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const projectId = useProjectId()

  const {
    data: paginatedData,
    isLoading: isLeadsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedLeads>(
    ["project-leads", projectId, currentPage, rowsPerPage, searchTerm],
    `/lead/project-leads?projectId=${
      projectId ?? 0
    }&page=${currentPage}&limit=${rowsPerPage}`,
    () => ({
      method: "get"
    })
  )

  console.log("paginatedData", paginatedData)

  const leads = useMemo((): Lead[] => {
    if (!paginatedData?.data) return []
    if (searchTerm) {
      return paginatedData.data.filter(
        lead =>
          lead.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return paginatedData.data
  }, [paginatedData, searchTerm])

  const totalPages = paginatedData?.total
    ? Math.ceil(paginatedData.total / rowsPerPage)
    : 1

  const handleRowClick = (leadId: string | number): void => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
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
    if (selectedRows.length === leads.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(leads.map(lead => lead.id.toString()))
    }
  }

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="w-max flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">Chats</h1>
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
            <button
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
            </button>

            <div className="w-0.5 h-7 bg-gray-500/50" />

            <div className="flex items-center space-x-2.5">
              <input
                type="text"
                placeholder="Search by user name..."
                className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center border rounded-md px-2 py-1 text-sm">
                Country
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

            <div className="relative">
              <button className="flex items-center border rounded-md px-2 py-1 text-sm">
                Scoring
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

            <div className="relative">
              <button className="flex items-center border rounded-md px-2 py-1 text-sm">
                Duration
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

          <div className="flex space-x-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-4 py-1 text-sm ${
                  selectedTab === "history"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedTab("history")
                }}
              >
                Chat history
              </button>
              <button
                className={`px-4 py-1 text-sm ${
                  selectedTab === "live"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedTab("live")
                }}
              >
                Live chat
              </button>
            </div>

            <button className="border rounded-md px-2 py-1 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
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
            <div className="w-full h-96 flex justify-center items-center">
              <LoadingIcon
                className={`w-40 h-40 font-thin fill-gray-500/50 ${
                  isLeadsLoading
                    ? "animate-pulse animate-infinite animate-ease-in-out animate-alternate-reverse animate-fill-both"
                    : ""
                }`}
              />
            </div>
          ) : leads.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/75 text-left">
                <tr>
                  <th className="p-4 w-8">
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
                  <th className="p-4 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 align-middle cursor-pointer"
                    onClick={() => {
                      handleRowClick(lead.id)
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
                        checked={selectedRows.includes(lead.id.toString())}
                        onChange={() => {
                          toggleRowSelection(lead.id.toString())
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 text-sm">{lead.userName}</td>
                    <td className="p-4 text-sm">{lead.email}</td>
                    <td className="p-4 text-sm text-green-600">
                      {lead.phoneNumber}
                    </td>
                    <td className="p-4 text-sm">5</td>
                    <td className="p-4 text-sm">new</td>
                    <td className="p-4 text-sm">{lead.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-full h-96 flex flex-col justify-center items-center">
              <NoDataIcon className="w-40 h-40 fill-gray-500/50" />
              <p className="text-lg text-gray-500/75">No chats available</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
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

            {selectedLead && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        User Name
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {selectedLead.userName}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {selectedLead.email}
                      </p>
                    </div>

                    {/* You may not have status in ChatConversation, so show N/A or add logic if available */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Number
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-blue-600">
                          {selectedLead.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Lead Score
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-yellow-600">
                          N/A
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Status
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        N/A
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-16 flex flex-col justify-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Created On
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {selectedLead.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-h-16 flex flex-col justify-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Content
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
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
