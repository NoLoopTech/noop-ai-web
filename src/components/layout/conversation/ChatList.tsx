"use client"

import { JSX, useMemo, useTransition, useRef, useEffect, useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchInput } from "@/components/SearchInput"
import { formatDate } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery } from "@/query"
import { PaginatedResult } from "@/types/paginatedData"
import { ChatSessionResponse } from "@/models/conversation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import countryData from "@/lib/countryData.json"

function getScoreBgClass(score: string) {
  switch (score) {
    case "negative":
      return "bg-badge-negative-background"
    case "normal":
      return "bg-badge-normal-background"
    case "positive":
      return "bg-badge-positive-background"
    default:
      return null
  }
}

export default function ChatList(): JSX.Element {
  const router = useRouter()
  const projectId = useProjectCode()
  const params = useParams()
  const { id: threadId } = params as { id: string }
  const [isPending, startTransition] = useTransition()
  const [pendingThreadId, setPendingThreadId] = useState<string | null>(null)
  const selectedItemRef = useRef<HTMLDivElement>(null)
  const isInitialRender = useRef(true)

  const getCountryName = (code: string) => {
    const country = countryData.find(c => c.code === code)
    return country ? country.name : code
  }

  const { data: paginatedData, isLoading: isChatsLoading } = useApiQuery<
    PaginatedResult<ChatSessionResponse>
  >(
    ["message-thread", projectId],
    `/conversations?projectId=${projectId ?? 0}&sortBy=createdAt&sortDir=DESC`, // TODO: Implement load more functionality
    () => ({
      method: "get"
    })
  )

  const conversationList = useMemo(() => {
    if (!paginatedData?.data) return []
    return paginatedData.data.map(session => ({
      id: session.session.threadId,
      userName: session.session.userName
        ? getCountryName(session.session.country)
        : "Guest User",
      summary: session.session.summary ?? "No summary",
      score: session.session.score ?? "Positive",
      date: new Date(session.session.createdAt)
    }))
  }, [paginatedData])

  const handleConversationSelect = (newThreadId: string): void => {
    setPendingThreadId(newThreadId)
    isInitialRender.current = false
    startTransition(() => {
      router.push(
        `/admin/dashboard/${String(projectId ?? 0)}/chats/${newThreadId}`
      )
    })
  }

  useEffect(() => {
    if (isInitialRender.current && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      })
      isInitialRender.current = false
    }
  }, [])

  return (
    <Card className="flex h-full flex-col items-center overflow-hidden rounded-lg">
      <CardContent className="h-full w-full p-0">
        <div className="sticky flex items-center justify-between p-3">
          <SearchInput className="w-full" />
        </div>
        <ScrollArea
          className="h-full w-full overflow-y-auto rounded-lg px-2.5 pb-[70px]"
          scrollbarVariant="tiny"
          orientation="vertical"
        >
          <div className="flex flex-col items-center justify-between space-y-2">
            {isChatsLoading ? (
              // INFO: Skeleton loading state
              Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center space-y-2.5 px-2 py-4"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="shine h-2.5 w-24 rounded-sm"></div>
                    <div className="shine h-2.5 w-9 rounded-md"></div>
                  </div>
                  <div className="shine h-2 w-full rounded-sm"></div>
                </div>
              ))
            ) : conversationList?.length > 0 ? (
              conversationList.map(conversation => {
                const isSelected = threadId === conversation.id
                const isLoading =
                  isPending && pendingThreadId === conversation.id
                return (
                  <Card
                    key={conversation.id}
                    ref={isSelected ? selectedItemRef : null}
                    className={`h-max w-full cursor-pointer rounded-lg px-1 py-0.5 transition-all duration-200 ease-in-out hover:bg-zinc-100 dark:hover:bg-zinc-700 ${threadId === conversation.id ? "bg-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800 dark:hover:bg-zinc-700" : ""}`}
                    onClick={() => handleConversationSelect(conversation.id)}
                  >
                    {isLoading ? (
                      <div className="flex w-full flex-col items-center space-y-2.5 px-2 py-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="shine h-2.5 w-24 rounded-sm"></div>
                          <div className="shine h-2.5 w-9 rounded-md"></div>
                        </div>
                        <div className="shine h-2 w-full rounded-sm"></div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="flex items-center justify-between p-2 pb-1.5 text-lg font-semibold">
                          <p className="text-sm font-medium">
                            {conversation.userName}
                          </p>
                          <p className="text-chat-info-text-muted text-tiny font-normal">
                            {conversation.date
                              ? formatDate(conversation.date, "M/dd/yyyy")
                              : "N/A"}
                          </p>
                        </CardTitle>
                        <CardContent className="flex items-center justify-between px-2 pb-2.5">
                          <p className="text-chat-info-text-muted max-w-52 truncate text-xs font-normal text-ellipsis">
                            {conversation.summary}
                          </p>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`size-2 rounded-full ${getScoreBgClass(conversation.score)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="center"
                              className="text-tiny bg-background text-foreground capitalize shadow"
                            >
                              <span>{conversation.score}</span>
                            </TooltipContent>
                          </Tooltip>
                        </CardContent>
                      </>
                    )}
                  </Card>
                  // TODO: Add the "Load More" button and functionality
                )
              })
            ) : (
              <p className="text-sm text-gray-500">
                No conversations available.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
