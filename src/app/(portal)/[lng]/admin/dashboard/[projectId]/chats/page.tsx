"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useApiQuery } from "@/query"
import {
  type ChatConversation,
  type ChatMessage,
  type GroupedConversations
} from "@/models/conversation"
import { useRouter } from "next/navigation"
import { calculateConversationDuration } from "@/utils/calculateConversationDuration"
import RefreshIcon from "@/../public/assets/icons/refresh-icon.svg"
import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import NoDataIcon from "@/../public/assets/icons/no-data-icon.svg"
import { useProjectId } from "@/lib/hooks/useProjectId"
import { type PaginatedResult } from "@/types/paginatedData"

type PaginatedChats = PaginatedResult<ChatMessage>

const groupConversationsByThread = (
  messages: ChatMessage[]
): GroupedConversations => {
  if (!messages) return {}
  return messages.reduce<GroupedConversations>((acc, message) => {
    const { threadId } = message
    if (!acc[threadId]) {
      acc[threadId] = []
    }
    acc[threadId].push(message)
    return acc
  }, {})
}

export default function ChatsPage(): JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("history")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const projectId = useProjectId()

  const {
    data: paginatedData,
    isLoading: isChatsLoading,
    isFetching,
    refetch
  } = useApiQuery<PaginatedChats>(
    ["project-conversations", projectId, currentPage, rowsPerPage, searchTerm],
    `/conversation/project-conversations?projectId=${
      projectId ?? 0
    }&page=${currentPage}&limit=${rowsPerPage}&search=${searchTerm}`,
    () => ({
      method: "get"
    })
  )

  const chatConversations = useMemo((): ChatConversation[] => {
    if (!paginatedData?.data) {
      return []
    }

    const grouped = groupConversationsByThread(paginatedData.data)

    const conversations = Object.entries(grouped).map(
      ([threadId, messages]) => {
        const firstMessage = messages[0]
        const lastMessage = messages[messages.length - 1]

        return {
          id: threadId,
          country: lastMessage.country ?? "lk",
          userName: lastMessage.userName ?? "Guest User",
          email: lastMessage.email ?? "No email",
          scoring: "N/A",
          duration: calculateConversationDuration(
            firstMessage.createdAt,
            lastMessage.createdAt
          ),
          summary:
            messages.find(m => m.sender === "user")?.content.substring(0, 30) ??
            "No summary",
          messages,
          chatbotCode: firstMessage.project.chatbotCode ?? ""
        }
      }
    )

    return conversations
  }, [paginatedData])

  const totalPages = paginatedData?.total
    ? Math.ceil(paginatedData.total / rowsPerPage)
    : 1

  const handleRowClick = (threadId: string): void => {
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
      setSelectedRows(chatConversations.map(chat => chat.id))
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
          ) : chatConversations.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/75 text-left">
                <tr>
                  <th className="p-4 w-8">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === chatConversations.length}
                      onChange={toggleAllRows}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 w-5 text-sm font-medium">Country</th>
                  <th className="p-4 text-sm font-medium">User Name</th>
                  <th className="p-4 text-sm font-medium">Email</th>
                  <th className="p-4 text-sm font-medium">AI Scoring</th>
                  <th className="p-4 text-sm font-medium">Duration</th>
                  <th className="p-4 text-sm font-medium">Chat Summary</th>
                  <th className="p-4 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {chatConversations.map(chat => (
                  <tr
                    key={chat.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 align-middle cursor-pointer"
                    onClick={() => {
                      handleRowClick(chat.id)
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
                        checked={selectedRows.includes(chat.id)}
                        onChange={() => {
                          toggleRowSelection(chat.id)
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="h-full pl-5">
                      <Image
                        src={`/assets/flags/${chat.country}.svg`}
                        alt={`${chat.country} flag`}
                        width={24}
                        height={16}
                        // className="w-6 h-4 mr-2"
                      />
                    </td>
                    <td className="p-4 text-sm">{chat.userName}</td>
                    <td className="p-4 text-sm">{chat.email}</td>
                    <td className="p-4 text-sm text-green-600">
                      {chat.scoring}
                    </td>
                    <td className="p-4 text-sm">{chat.duration}</td>
                    <td className="p-4 text-sm">{chat.summary}</td>
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
      </Card>
    </div>
  )
}
