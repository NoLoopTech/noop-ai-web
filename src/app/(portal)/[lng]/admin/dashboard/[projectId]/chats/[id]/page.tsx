"use client"

import { useMemo, useState, useRef, useEffect, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useApiQuery } from "@/query"
import {
  type ChatMessage,
  type PaginatedChats,
  type GroupedConversations,
  type ChatConversation
} from "@/models/conversation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import LoadingIcon from "@/../public/assets/icons/loading-icon.svg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Markdown from "react-markdown"
import { formatDate } from "@/utils/formatDate"

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

const calculateConversationDuration = (
  startTime: string,
  endTime: string
): string => {
  if (!startTime || !endTime) return "0 secs"
  const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()
  if (durationMs <= 0) return "0 secs"
  const totalSeconds = Math.round(durationMs / 1000)
  if (totalSeconds < 60) return "< 1min"
  const totalMinutes = Math.round(totalSeconds / 60)
  if (totalMinutes < 60) return `${totalMinutes} mins`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const hourString = `${hours} h`
  const minuteString = minutes > 0 ? ` ${minutes} mins` : ""
  return `${hourString}${minuteString}`
}

const SidebarSkeleton = (): JSX.Element => (
  <aside className="w-80 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900/50 relative">
    <div className="p-4 border-b">
      <div className="h-7 bg-gray-300 rounded w-32 animate-pulse" />
    </div>
    <div className="overflow-y-auto h-[calc(100%-4.5rem)]">
      <nav>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full p-4 border-b">
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse mb-2" />
            <div className="h-3 bg-gray-300 rounded w-40 animate-pulse" />
          </div>
        ))}
      </nav>
    </div>
  </aside>
)

const ChatSkeleton = (): JSX.Element => (
  <div className="flex-1 p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`flex items-end gap-2 ${
          i % 2 === 0 ? "justify-start" : "justify-end"
        }`}
      >
        {i % 2 === 0 && (
          <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
        )}
        <div className={`max-w-xl rounded-lg px-4 py-2`}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-3 bg-gray-300 rounded w-16 mt-2 animate-pulse" />
        </div>
        {i % 2 === 1 && (
          <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
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
        <div className="w-8 h-6 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
      </div>
      <div className="text-sm space-y-2">
        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
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

  const { data: initialThreadMessages, isLoading: isInitialLoading } =
    useApiQuery<ChatMessage[]>(
      ["chat-thread", threadId],
      `/conversations/thread?threadId=${threadId}`,
      () => ({ method: "get" }),
      { enabled: !!threadId }
    )

  const projectId = initialThreadMessages?.[0]?.project?.id ?? ""

  const { data: paginatedData, isLoading: isConversationsLoading } =
    useApiQuery<PaginatedChats>(
      ["project-conversations", projectId],
      `/conversations?projectId=${projectId}&page=1&limit=1000`,
      () => ({ method: "get" }),
      { enabled: !!projectId }
    )

  const conversationList = useMemo((): ChatConversation[] => {
    if (!paginatedData?.data) return []
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
            messages.find(m => m.sender === "user")?.content.substring(0, 35) ??
            "No summary",
          messages,
          chatbotCode: firstMessage.project.chatbotCode ?? ""
        }
      }
    )
    conversations.sort((a, b) => {
      const lastMessageA = a.messages[a.messages.length - 1]
      const lastMessageB = b.messages[b.messages.length - 1]
      return (
        new Date(lastMessageB.createdAt).getTime() -
        new Date(lastMessageA.createdAt).getTime()
      )
    })
    return conversations
  }, [paginatedData])

  const selectedConversation = useMemo(
    () => conversationList.find(c => c.id === threadId),
    [conversationList, threadId]
  )

  const messages = selectedConversation?.messages ?? []
  const conversationDetails = useMemo(() => {
    if (!selectedConversation) return null
    return {
      userName: selectedConversation.userName,
      email: selectedConversation.email,
      country: selectedConversation.country,
      chatbotCode: selectedConversation.messages[0].project.chatbotCode
    }
  }, [selectedConversation])

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
    }
  }, [messages])

  const handleConversationSelect = (newThreadId: string): void => {
    startTransition(() => {
      router.push(`/admin/dashboard/${projectId}/chats/${newThreadId}`)
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
    isInitialLoading ||
    (isConversationsLoading && !selectedConversation) ||
    isPending

  const isShowingSidebarSkeleton = isInitialLoading || isConversationsLoading

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900/50 relative">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Chats</h2>
        </div>
        <div
          ref={sidebarScrollRef}
          onScroll={handleSidebarScroll}
          className="overflow-y-auto h-[calc(100%-4.5rem)]"
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
                    className={`w-full text-left p-4 border-b ${
                      threadId === chat.id
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="font-semibold text-sm">{chat.userName}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat.summary}...
                    </p>
                  </button>
                ))}
            </nav>
          )}
          {!isConversationsLoading && conversationList.length > 0 && (
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
            className="absolute bottom-4 right-4 rounded-full"
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
      <main className="flex-1 flex flex-col">
        {isShowingSkeleton ? (
          <div className="flex h-full">
            {/* Chat Area Skeleton */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="h-7 bg-gray-300 rounded w-48 animate-pulse" />
                <div className="h-9 bg-gray-300 rounded w-32 animate-pulse" />
              </div>
              <ChatSkeleton />
              <div className="p-4 border-t bg-white dark:bg-gray-900">
                <div className="h-10 bg-gray-300 rounded animate-pulse" />
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
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
              <div className="p-4 border-b flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                  Conversation with {conversationDetails?.userName}
                </h1>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/admin/dashboard/${projectId}/chats`)
                  }}
                >
                  Back to List View
                </Button>
              </div>
              <div
                ref={chatContentRef}
                className="flex-1 p-6 space-y-4 overflow-y-auto"
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
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none"
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
                              className="list-decimal list-outside pl-8"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-outside pl-8"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              className="py-0.5 last-of-type:mb-1 first-of-type:mt-1"
                              {...props}
                            />
                          ),
                          // Links
                          a: ({ node, ...props }) => (
                            <a
                              className="text-blue-600 font-medium hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          // Blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-gray-300 pl-4 italic my-2"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="bg-gray-800 text-white p-2 rounded-md my-2 overflow-x-auto"
                              {...props}
                            />
                          )
                        }}
                      >
                        {message.content.replace(/<br\s*\/?>/gi, "")}
                      </Markdown>
                      <p
                        className={`text-xs mt-1 text-right ${
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
              <div className="p-4 border-t bg-white dark:bg-gray-900">
                <input
                  type="text"
                  placeholder="Live chat is not enabled for this view."
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
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
