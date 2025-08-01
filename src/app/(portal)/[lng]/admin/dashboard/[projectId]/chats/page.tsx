"use client"

import { JSX, useMemo, useState } from "react"
import countryDataJson from "@/lib/countryData.json"
import Image from "next/image"
import { Combobox } from "@/components/ui/combo-box"
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown"
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown"
import { Card } from "@/components/ui/card"
import { useApiQuery } from "@/query"
import { type ChatSessionResponse } from "@/models/conversation"
import { useRouter } from "next/navigation"
import RefreshIcon from "@/../public/assets/icons/refresh-icon.svg"
import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import NoDataIcon from "@/../public/assets/icons/no-data-icon.svg"
import { useProjectId } from "@/lib/hooks/useProjectId"
import { type PaginatedResult } from "@/types/paginatedData"
import { formatDate } from "@/utils/formatDate"
import {
  dateRangeOptions,
  durationOptions,
  scoringOptions,
  type DateRangeType
} from "@/models/filterOptions"

export default function ChatsPage(): JSX.Element {
  const handleTab = (tab: string) => () => {
    setSelectedTab(tab)
  }
  interface ChatFilters {
    username: string
    startDate: string
    endDate: string
    country: string
    scoring: string[]
    intent: string
    duration: string
  }

  function buildQueryString(filters: ChatFilters): string {
    const params = [
      `username=${encodeURIComponent(filters.username || "")}`,
      `startDate=${encodeURIComponent(filters.startDate || "")}`,
      `endDate=${encodeURIComponent(filters.endDate || "")}`,
      `country=${encodeURIComponent(filters.country || "")}`,
      `scoring=${encodeURIComponent(filters.scoring.join(",") || "")}`,
      `intent=${encodeURIComponent(filters.intent || "")}`,
      `duration=${encodeURIComponent(filters.duration || "")}`
    ]
    return params.join("&")
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

  // Helper to format date as yyyy-mm-dd
  const formatDateISO = (d: Date): string => {
    return d.toISOString().slice(0, 10)
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

  const [selectedScoring, setSelectedScoring] = useState<string[]>([])
  const [selectedIntent, setSelectedIntent] = useState("")
  const handleIntentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedIntent(e.target.value)
  }
  const [selectedDuration, setSelectedDuration] = useState("")

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("history")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const projectId = useProjectId()

  const filters: ChatFilters = {
    username: searchTerm,
    startDate,
    endDate,
    country: selectedCountry,
    scoring: selectedScoring,
    intent: selectedIntent,
    duration: selectedDuration
  }

  const queryString =
    `/conversations?projectId=${projectId ?? 0}` +
    `&page=${currentPage}` +
    `&limit=${rowsPerPage}` +
    `&sortBy=createdAt` +
    `&sortDir=DESC` +
    `&${buildQueryString(filters)}`

  const {
    data: paginatedData,
    isLoading: isChatsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedResult<ChatSessionResponse>>(
    [
      "project-conversations",
      projectId,
      currentPage,
      rowsPerPage,
      searchTerm,
      startDate,
      endDate,
      selectedDuration
    ],
    queryString,
    () => ({ method: "get" })
  )

  const chatConversations = useMemo((): ChatSessionResponse[] => {
    if (!paginatedData?.data) return []
    return paginatedData.data
  }, [paginatedData, searchTerm])

  const totalPages = paginatedData?.total
    ? Math.ceil(paginatedData.total / rowsPerPage)
    : 1

  const handleRowClick = (threadId: string): void => {
    // console.log("Row clicked:", threadId)
    router.push(threadId)
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
    if (selectedRows.length === chatConversations.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(chatConversations.map(chat => chat.session.id.toString()))
    }
  }

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const handleRowCheckboxChange = (id: string) => () => {
    toggleRowSelection(id)
  }

  const handleDateDropdownChange = (val: string): void => {
    handleDateRangeChange(val as DateRangeType)
  }

  const secondsToMinutes = (seconds: number): string => {
    if (seconds <= 60) {
      return "< 1min"
    }
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min${minutes > 1 ? "s" : ""}`
  }

  const handleTableRowClick = (threadId: string) => () => {
    handleRowClick(threadId)
  }
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  const handleRowCheckboxChangeClick = (id: string) => () => {
    handleRowCheckboxChange(id)
  }
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }
  const handleRefresh = () => {
    void refetch()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex w-max items-center space-x-2">
        <h1 className="text-2xl font-semibold">Chats</h1>
      </div>

      <Card className="overflow-hidden rounded-md border p-0">
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
            <div className="flex space-x-2">
              <div className="flex overflow-hidden rounded-md border">
                <button
                  className={`border-r px-4 py-1 text-sm font-medium first:rounded-l-md last:rounded-r-md focus:outline-none ${
                    selectedTab === "history"
                      ? "bg-background text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                      : "text-gray-400 opacity-60 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                  onClick={handleTab("history")}
                >
                  Chat history
                </button>
                <button
                  className={`border-r px-4 py-1 text-sm font-medium first:rounded-l-md last:rounded-r-md focus:outline-none ${
                    selectedTab === "live"
                      ? "bg-background text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                      : "text-gray-400 opacity-60 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                  onClick={handleTab("live")}
                >
                  Live chat
                </button>
              </div>
            </div>
            <div className="h-7 w-0.5 bg-gray-500/50" />
            <button
              onClick={handleRefresh}
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
                placeholder="Search by user name..."
                className="rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                }}
              />
            </div>

            <div className="w-44">
              <Combobox
                options={countryDataJson.map(c => ({
                  value: c.code,
                  label: c.name
                }))}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Country"
              />
            </div>

            <div className="w-32">
              <MultiSelectDropdown
                options={[...scoringOptions]}
                values={selectedScoring}
                onChange={setSelectedScoring}
                placeholder="Scoring"
              />
            </div>

            <div className="relative">
              <select
                className="bg-background dark:bg-background appearance-none rounded-md border px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-100"
                style={{ backgroundImage: "none" }}
                value={selectedIntent}
                onChange={handleIntentChange}
              >
                <option
                  value=""
                  className="bg-background text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                >
                  Intent
                </option>
              </select>
            </div>

            <div className="relative">
              <SingleSelectDropdown
                options={[...durationOptions]}
                value={selectedDuration}
                onChange={setSelectedDuration}
                placeholder="Duration"
                className="w-40"
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
          {isChatsLoading ? (
            <div className="flex h-96 w-full items-center justify-center">
              <LoadingIcon
                className={`h-40 w-40 fill-gray-500/50 font-thin ${
                  isChatsLoading
                    ? "animate-infinite animate-ease-in-out animate-alternate-reverse animate-fill-both animate-pulse"
                    : ""
                }`}
              />
            </div>
          ) : chatConversations.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-left dark:bg-gray-900/75">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === chatConversations.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="w-32 py-4 text-center text-sm font-medium">
                    Country
                  </th>
                  <th className="w-32 py-4 text-center text-sm font-medium">
                    AI Scoring
                  </th>
                  <th className="w-32 py-4 text-center text-sm font-medium">
                    Duration
                  </th>
                  <th className="p-4 text-sm font-medium">Chat Summary</th>
                  <th className="p-4 text-sm font-medium">Date/Time</th>
                  <th className="w-8 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {chatConversations.map(chat => (
                  <tr
                    key={chat.session.id}
                    className="cursor-pointer align-middle hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleTableRowClick(chat.session.threadId)}
                  >
                    <td className="p-4" onClick={handleCheckboxClick}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          chat.session.id.toString()
                        )}
                        onChange={handleRowCheckboxChangeClick(
                          chat.session.id.toString()
                        )}
                        className="rounded"
                      />
                    </td>
                    <td className="h-full w-32">
                      <Image
                        src={`/assets/flags/${chat.session.country}.svg`}
                        alt={`${
                          chat.session.country
                            ? chat.session.country + " flag"
                            : "N/A"
                        }`}
                        width={24}
                        height={16}
                        className="flex max-h-4 w-32 items-center justify-center text-xs"
                      />
                    </td>
                    <td className="w-32 p-4 text-center align-middle text-sm text-green-600">
                      {chat.session.score}
                    </td>
                    <td className="w-32 p-4 text-center align-middle text-sm">
                      {secondsToMinutes(chat.duration)}
                    </td>
                    <td className="p-4 text-sm">{chat.session.summary}</td>
                    <td className="w-48 p-4 text-sm">
                      {formatDate(chat.session.createdAt)}
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
              className="bg-background rounded border px-2 py-1 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100"
            >
              <option
                value="10"
                className="bg-background text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              >
                10
              </option>
              <option
                value="25"
                className="bg-background text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              >
                25
              </option>
              <option
                value="50"
                className="bg-background text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              >
                50
              </option>
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
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
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
      </Card>
    </div>
  )
}
