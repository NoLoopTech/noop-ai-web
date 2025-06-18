"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

// Mock data for chat conversations
const MOCK_CHATS = [
  {
    id: 1,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 2,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 3,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 4,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 5,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 6,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 7,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 8,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 9,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  },
  {
    id: 10,
    country: "es",
    userName: "Michael Wilson",
    email: "example@gmail.com",
    scoring: "Positive",
    duration: "10 mins",
    summary: "A small description of the ai chat"
  }
]

export default function ChatsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("history")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [dateRange] = useState("Feb 03, 2025 - Feb 09, 2025")
  const [currentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Toggle row selection
  const toggleRowSelection = (id: number): void => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Toggle all rows selection
  const toggleAllRows = (): void => {
    if (selectedRows.length === MOCK_CHATS.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(MOCK_CHATS.map(chat => chat.id))
    }
  }

  return (
    <div className="flex flex-col p-6 gap-6">
      <h1 className="text-2xl font-semibold">Chats</h1>

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

          <div className="flex items-center space-x-2">
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
            <input
              type="text"
              placeholder="Search by user name..."
              className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800">
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
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === MOCK_CHATS.length}
                    onChange={toggleAllRows}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-sm font-medium">Country</th>
                <th className="p-4 text-sm font-medium">User Name</th>
                <th className="p-4 text-sm font-medium">Email</th>
                <th className="p-4 text-sm font-medium">AI Scoring</th>
                <th className="p-4 text-sm font-medium">Duration</th>
                <th className="p-4 text-sm font-medium">Chat Summary</th>
                <th className="p-4 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_CHATS.map(chat => (
                <tr
                  key={chat.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(chat.id)}
                      onChange={() => {
                        toggleRowSelection(chat.id)
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Image
                        src={`/assets/flags/${chat.country}.svg`}
                        alt={`${chat.country} flag`}
                        width={24}
                        height={16}
                        className="w-6 h-4 mr-2"
                        onError={e => {
                          // Fallback for missing flag images
                          ;(e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/24x16"
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-sm">{chat.userName}</td>
                  <td className="p-4 text-sm">{chat.email}</td>
                  <td className="p-4 text-sm text-green-600">{chat.scoring}</td>
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
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedRows.length > 0
              ? `${selectedRows.length} of ${MOCK_CHATS.length} row(s) selected.`
              : `0 of ${MOCK_CHATS.length} row(s) selected.`}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value))
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

            <div className="flex items-center space-x-1 ml-4">
              <span className="text-sm">Page 1 of 10</span>

              <button
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={currentPage === 1}
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

              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
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

              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
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
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
