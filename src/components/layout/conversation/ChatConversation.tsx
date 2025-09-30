"use client"

import { JSX, useEffect, useMemo, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/models/conversation"
import { IconSend } from "@tabler/icons-react"
import { format } from "date-fns"
import Markdown from "react-markdown"
import { PaginatedResult } from "@/types/paginatedData"
import { useParams } from "next/navigation"
import { useApiQuery } from "@/query"
import ChatScoreBadge from "@/components/ChatScoreBadge"
import { getScoreVariant } from "@/utils"
import ImproveAnswerDrawer from "./ImproveAnswerDrawer"

interface Props {
  isViewOnly?: boolean
}

function groupMessagesByDate(messages: ChatMessage[]) {
  return messages.reduce<Record<string, ChatMessage[]>>((groups, msg) => {
    const date = format(new Date(msg.createdAt), "yyyy-MM-dd")
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})
}

export default function ChatConversation({
  isViewOnly = false
}: Props): JSX.Element {
  const params = useParams()
  const { id: threadId } = params as { id: string }

  const listRef = useRef<HTMLDivElement>(null)
  const lastItemRef = useRef<HTMLDivElement>(null)

  const [isImproveDrawerOpen, setImproveDrawerOpen] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<{
    userMessage: string
    aiResponse: string
  } | null>(null)

  const { data: initialThreadMessages, isLoading: isInitialLoading } =
    useApiQuery<PaginatedResult<ChatMessage>>(
      ["chat-thread", threadId],
      `/conversations/thread?threadId=${threadId}&sortBy=createdAt&sortDir=ASC`,
      () => ({ method: "get" }),
      { enabled: !!threadId }
    )

  const selectedConversation = useMemo(() => {
    if (!initialThreadMessages?.data) return undefined
    return {
      id: threadId,
      messages: initialThreadMessages.data
    }
  }, [threadId, initialThreadMessages])

  const grouped = useMemo(() => {
    return selectedConversation?.messages
      ? groupMessagesByDate(selectedConversation.messages)
      : {}
  }, [selectedConversation])

  const groupDates = useMemo(() => Object.keys(grouped).sort(), [grouped])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight

      if (lastItemRef.current) {
        lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    }
  }, [grouped])

  const handleImproveAnswerClick = (message: ChatMessage) => () => {
    if (selectedConversation?.messages) {
      const messageIndex = selectedConversation.messages.findIndex(
        m => m.id === message.id
      )
      if (messageIndex > 0) {
        const userMessage = selectedConversation.messages[messageIndex - 1]
        if (userMessage?.sender === "user") {
          setSelectedMessages({
            userMessage: userMessage.content,
            aiResponse: message.content
          })
          setImproveDrawerOpen(true)
        }
      }
    }
  }

  return (
    <Card className="flex h-full flex-col items-center space-y-3 rounded-lg">
      <CardContent className="flex h-full w-full flex-col justify-between rounded-t-lg p-0 pt-2">
        <ScrollArea
          className="max-h-max w-full px-4"
          orientation="vertical"
          scrollbarVariant="tiny"
        >
          <div
            ref={listRef}
            className="flex max-h-max flex-col space-y-4 pt-3 pb-5"
          >
            {isInitialLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col space-y-2.5 px-2 py-1"
                  >
                    <div className="flex space-y-2.5 space-x-1">
                      <div className="shine h-8 w-8 rounded-full"></div>
                      <div className="flex flex-col space-y-2">
                        <div className="shine h-2.5 w-16 rounded-sm"></div>
                        <div className="shine h-2.5 w-60 rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex w-full justify-end space-y-2.5 space-x-1">
                      <div className="flex flex-col space-y-2">
                        <div className="shine h-2.5 w-16 self-end rounded-sm"></div>
                        <div className="shine h-2.5 w-60 self-end rounded-md"></div>
                      </div>
                      <div className="shine h-8 w-8 rounded-full"></div>
                    </div>
                  </div>
                ))
              : groupDates.map(date => (
                  <div key={date}>
                    <div className="mb-2 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {format(new Date(date), "MMM dd, yyyy")}
                    </div>
                    {grouped[date].map(message => (
                      <div
                        key={message.id}
                        className={`mt-5 flex w-full items-start gap-3 ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={
                              message.sender === "user"
                                ? "/assets/icons/user-avatar.png"
                                : "/assets/icons/bot-avatar.png"
                            }
                            alt={message.sender === "user" ? "User" : "Noopy"}
                          />
                          <AvatarFallback
                            className={`${
                              message.sender === "user"
                                ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-500 dark:text-zinc-100"
                            }`}
                          >
                            {message.sender === "user"
                              ? (message.userName?.charAt(0) ?? "G")
                              : "N"}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col ${
                            message.sender === "user"
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`text-foreground relative max-w-11/12 min-w-xs rounded-lg p-4 text-sm font-medium ${
                              message.sender === "user"
                                ? "rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
                                : "rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-500 dark:text-zinc-100"
                            }`}
                          >
                            {message.sender === "ai" && (
                              <h3 className="mb-1 text-sm font-medium">
                                Noopy
                              </h3>
                            )}
                            <Markdown
                              components={{
                                h1: ({ node, ...props }) => (
                                  <h1
                                    className="text-xl font-bold"
                                    {...props}
                                  />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2
                                    className="text-lg font-bold"
                                    {...props}
                                  />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3
                                    className="text-md font-bold"
                                    {...props}
                                  />
                                ),
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
                                a: ({ node, ...props }) => (
                                  <a
                                    className="font-medium text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                  />
                                ),
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
                              {message.content}
                            </Markdown>
                            {message.sender === "ai" && (
                              <div className="absolute right-5 -bottom-4 flex items-center space-x-2">
                                <div
                                  onClick={handleImproveAnswerClick(message)}
                                  className="cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-[3.5px] text-xs font-medium text-zinc-500 shadow transition-colors duration-300 hover:bg-zinc-200"
                                >
                                  <span>Improve answer</span>
                                </div>
                                <ChatScoreBadge
                                  variant={getScoreVariant(
                                    Number(message.confidenceScore ?? 0)
                                  )}
                                  value={String(message.confidenceScore ?? 0)}
                                />
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs font-normal text-zinc-600">
                            {format(new Date(message.createdAt), "p")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
          </div>
          <div ref={lastItemRef} />
        </ScrollArea>
        {!isViewOnly && (
          <div className="bg-background flex items-center space-x-2 rounded-b-lg border-t p-3">
            <Input
              type="text"
              placeholder="Live chat is not enabled for this view."
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
              disabled
            />
            <Button className="min-w-10 p-0" variant="default" disabled>
              <IconSend className="size-5" />
            </Button>
          </div>
        )}
      </CardContent>

      <ImproveAnswerDrawer
        open={isImproveDrawerOpen}
        onOpenChange={setImproveDrawerOpen}
        userMessage={selectedMessages?.userMessage}
        aiResponse={selectedMessages?.aiResponse}
      />
    </Card>
  )
}
