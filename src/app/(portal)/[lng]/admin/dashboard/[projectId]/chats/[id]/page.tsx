"use client"

import { useMemo, useState, useRef, useEffect, useTransition, JSX } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useApiQuery } from "@/query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Markdown from "react-markdown"
import { formatDate } from "@/utils/formatDate"
import { type PaginatedResult } from "@/types/paginatedData"
import {
  type ChatMessage,
  type ChatSessionResponse
} from "@/models/conversation"
import { useProjectId } from "@/lib/hooks/useProjectId"

const SidebarSkeleton = (): JSX.Element => (
  <aside className="relative w-80 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900/50">
    <div className="border-b p-4">
      <div className="h-7 w-32 animate-pulse rounded bg-gray-300" />
    </div>
    <div className="h-[calc(100%-4.5rem)] overflow-y-auto">
      <nav>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full border-b p-4">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-300" />
            <div className="h-3 w-40 animate-pulse rounded bg-gray-300" />
          </div>
        ))}
      </nav>
    </div>
  </aside>
)

const ChatSkeleton = (): JSX.Element => (
  <div className="flex-1 space-y-4 p-6">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`flex items-end gap-2 ${
          i % 2 === 0 ? "justify-start" : "justify-end"
        }`}
      >
        {i % 2 === 0 && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
        )}
        <div className={`max-w-xl rounded-lg px-4 py-2`}>
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
          </div>
          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-300" />
        </div>
        {i % 2 === 1 && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
        )}
      </div>
    ))}
  </div>
)

const DetailsSkeleton = (): JSX.Element => (
  <Card>
    <CardHeader>
      <CardTitle>Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-6 w-8 animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
      </div>
      <div className="space-y-2 text-sm">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />
      </div>
    </CardContent>
  </Card>
)

export default function ChatDetailsPage(): JSX.Element {
  const router = useRouter()
  const params = useParams()
  const { id: threadId } = params as { id: string }
  const sidebarScrollRef = useRef<HTMLDivElement>(null)
  const chatContentRef = useRef<HTMLDivElement>(null)

  const [visibleConversationsCount, setVisibleConversationsCount] = useState(10)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isPending, startTransition] = useTransition()

  const projectId = useProjectId()

  const { data: paginatedData, isLoading: isChatsLoading } = useApiQuery<
    PaginatedResult<ChatSessionResponse>
  >(
    ["message-thread", projectId],
    `/conversations?projectId=${
      projectId ?? 0
    }&page=${1}&limit=${10}&sortBy=createdAt&sortDir=DESC`,
    () => ({
      method: "get"
    })
  )

  const { data: initialThreadMessages, isLoading: isInitialLoading } =
    useApiQuery<PaginatedResult<ChatMessage>>(
      ["chat-thread", threadId],
      `/conversations/thread?threadId=${threadId}`,
      () => ({ method: "get" }),
      { enabled: !!threadId }
    )

  const conversationList = useMemo(() => {
    if (!paginatedData?.data) return []
    return paginatedData.data.map(session => ({
      id: session.session.threadId,
      userName: session.session.country ?? "Guest User",
      summary: session.session.summary ?? "No summary",
      country: session.session.country ?? "N/A"
    }))
  }, [paginatedData])

  const selectedConversation = useMemo(() => {
    const base = conversationList.find(c => c.id === threadId)
    if (!base) return undefined
    return {
      ...base,
      messages: initialThreadMessages?.data ?? []
    }
  }, [conversationList, threadId, initialThreadMessages])

  const messages = selectedConversation?.messages ?? []

  const conversationDetails = useMemo(() => {
    if (!selectedConversation?.messages.length) return null
    const firstMsg = selectedConversation.messages[0]
    return {
      userName: firstMsg.userName ?? "Guest User",
      email: firstMsg.email ?? "No email",
      country: firstMsg.country ?? "lk"
    }
  }, [selectedConversation])

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
    }
  }, [messages])

  const handleConversationSelect = (newThreadId: string): void => {
    startTransition(() => {
      router.push(
        `/admin/dashboard/${String(projectId ?? 0)}/chats/${newThreadId}`
      )
    })
  }

  const handleLoadMore = (): void => {
    setVisibleConversationsCount(prevCount => prevCount + 10)
  }

  const handleSidebarScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    setShowScrollTop(e.currentTarget.scrollTop > 200)
  }

  const scrollToTop = (): void => {
    sidebarScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isShowingSkeleton =
    isInitialLoading || (isChatsLoading && !selectedConversation) || isPending

  const isShowingSidebarSkeleton = isInitialLoading || isChatsLoading

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t">
      {/* Sidebar */}
      <aside className="relative w-80 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900/50">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">All Chats</h2>
        </div>
        <div
          ref={sidebarScrollRef}
          onScroll={handleSidebarScroll}
          className="h-[calc(100%-4.5rem)] overflow-y-auto"
        >
          {isShowingSidebarSkeleton ? (
            <SidebarSkeleton />
          ) : (
            <nav>
              {conversationList
                .slice(0, visibleConversationsCount)
                .map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      handleConversationSelect(chat.id)
                    }}
                    className={`w-full border-b p-4 text-left ${
                      threadId === chat.id
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="text-sm font-semibold">{chat.userName}</div>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {chat.summary}...
                    </p>
                  </button>
                ))}
            </nav>
          )}
          {!isChatsLoading && conversationList.length > 0 && (
            <div className="p-4 text-center">
              {visibleConversationsCount < conversationList.length ? (
                <Button variant="outline" onClick={handleLoadMore}>
                  Load More
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  All conversations loaded.
                </p>
              )}
            </div>
          )}
        </div>
        {showScrollTop && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="absolute right-4 bottom-4 rounded-full"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
          </Button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {isShowingSkeleton ? (
          <div className="flex h-full">
            {/* Chat Area Skeleton */}
            <div className="flex h-full flex-1 flex-col bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between border-b p-4">
                <div className="h-7 w-48 animate-pulse rounded bg-gray-300" />
                <div className="h-9 w-32 animate-pulse rounded bg-gray-300" />
              </div>
              <ChatSkeleton />
              <div className="border-t bg-white p-4 dark:bg-gray-900">
                <div className="h-10 animate-pulse rounded bg-gray-300" />
              </div>
            </div>

            {/* Details Panel Skeleton */}
            <div className="w-80 border-l p-4">
              <DetailsSkeleton />
            </div>
          </div>
        ) : !selectedConversation ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <p className="text-lg text-gray-500">
              Conversation not found or still loading.
            </p>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Chat Area */}
            <div className="flex h-full flex-1 flex-col bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between border-b p-4">
                <h1 className="text-xl font-semibold">
                  Conversation with {conversationDetails?.userName}
                </h1>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/admin/dashboard/${projectId ?? 0}/chats`)
                  }}
                >
                  Back to List View
                </Button>
              </div>
              <div
                ref={chatContentRef}
                className="flex-1 space-y-4 overflow-y-auto p-6"
              >
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/assets/icons/bot-avatar.png"
                          alt="AI"
                        />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xl rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "rounded-br-none bg-blue-500 text-white"
                          : "rounded-bl-none bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <Markdown
                        components={{
                          // Headings
                          h1: ({ node, ...props }) => (
                            <h1 className="text-xl font-bold" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-lg font-bold" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-md font-bold" {...props} />
                          ),
                          // Lists
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-outside list-decimal pl-8"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-outside list-disc pl-8"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              className="py-0.5 first-of-type:mt-1 last-of-type:mb-1"
                              {...props}
                            />
                          ),
                          // Links
                          a: ({ node, ...props }) => (
                            <a
                              className="font-medium text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          // Blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="my-2 border-l-4 border-gray-300 pl-4 italic"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="my-2 overflow-x-auto rounded-md bg-gray-800 p-2 text-white"
                              {...props}
                            />
                          )
                        }}
                      >
                        {message.content.replace(/<br\s*\/?>/gi, "")}
                      </Markdown>
                      <p
                        className={`mt-1 text-right text-xs ${
                          message.sender === "user"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/assets/icons/user-avatar.png"
                          alt="User"
                        />
                        <AvatarFallback>
                          {conversationDetails?.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t bg-white p-4 dark:bg-gray-900">
                <input
                  type="text"
                  placeholder="Live chat is not enabled for this view."
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                  disabled
                />
              </div>
            </div>

            {/* Details Panel */}
            <div className="w-80 border-l p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/assets/flags/lk.svg`}
                      alt={`LK flag`}
                      width={32}
                      height={24}
                    />
                    <span className="font-medium">
                      {conversationDetails?.userName}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-500">
                      {conversationDetails?.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
