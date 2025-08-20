"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  IconArrowRight,
  IconBellRinging,
  IconDotsVertical,
  IconExclamationCircle,
  IconInfoCircle,
  // IconMessages,
  IconPlus,
  IconTrendingUp,
  IconUsers
} from "@tabler/icons-react"
import { Bot } from "lucide-react"
import { useParams } from "next/navigation"
import { JSX } from "react"
import { useApiQuery } from "@/query"
import { ChatDetailsDto } from "@/models/conversation"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatInfo(): JSX.Element {
  const params = useParams()
  const { id: threadId } = params as { id: string }

  const { data: chatDetails, isLoading } = useApiQuery<ChatDetailsDto>(
    ["chat-details", threadId],
    `/conversations/chatDetails?threadId=${threadId}`,
    () => ({
      method: "get"
    })
  )

  return (
    <ScrollArea
      orientation="vertical"
      scrollbarVariant="tiny"
      className="h-full w-full"
    >
      <div className="flex flex-col space-y-4 pr-3">
        <Card className="h-max w-full rounded-lg">
          <CardContent className="pb-0">
            <div className="flex flex-col items-center p-5">
              <h1 className="mb-3 text-2xl font-semibold">
                {isLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  (chatDetails?.userName ?? "Guest User")
                )}
              </h1>
              {isLoading ? (
                <Skeleton className="mb-2 h-4 w-40" />
              ) : (
                <p className="mb-2 text-sm font-medium">
                  {chatDetails?.email ?? "N/A"}
                </p>
              )}
              {isLoading ? (
                <Skeleton className="mb-2 h-4 w-40" />
              ) : (
                <p className="text-sm font-medium text-zinc-500">
                  {chatDetails?.phoneNumber ?? "N/A"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Button variant="default" className="w-full">
          Create Ticket
        </Button> */}

        <Card className="h-max w-full rounded-lg py-0">
          <CardTitle className="p-4 text-lg font-semibold">
            Active Context
          </CardTitle>
          <CardContent className="px-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-x-2">
                      <IconUsers className="size-4" />
                      <p className="text-sm font-medium">Active Tickets</p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent avoidCollisions>
                    <div className="max-w-72 space-y-2">
                      <div className="text-popover-foreground flex items-center space-x-3 text-sm font-semibold">
                        <p>Active Tickets</p>
                        <IconInfoCircle className="size-4" />
                      </div>
                      <div>
                        <p className="text-popover-foreground text-sm font-normal">
                          Number of unresolved support tickets created by this
                          user, either manually or triggered by chatbot
                          fallback.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {isLoading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  <p className="text-sm font-medium">
                    {chatDetails?.activeTicketCount ?? "N/A"}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <HoverCard openDelay={100}>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-x-2">
                      <IconExclamationCircle className="size-4" />
                      <p className="text-sm font-medium">
                        Potential Lead Score
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    avoidCollisions
                    className="max-w-sm min-w-80"
                  >
                    <div className="text-popover-foreground">
                      <div className="flex items-center space-x-3 text-sm font-semibold">
                        <p>Potential Lead</p>
                        <IconInfoCircle className="size-4" />
                      </div>
                      <div className="flex flex-col space-y-5">
                        <p className="text-sm font-normal">
                          A numerical score (0&#8211;100) predicting how likely
                          this user is to convert into a customer based on their
                          chat behavior.
                        </p>
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs font-semibold">
                            How it&apos;s generated:
                          </p>
                          <p className="text-sm font-normal">
                            The score is automatically calculated in real-time
                            by analysing user interactions across chats, using
                            behaviour signals and intent detection.
                          </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs font-semibold">
                            How it&apos;s calculated:
                          </p>
                          <div className="text-sm font-normal">
                            <p>Based on weighted inputs like:</p>
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm font-normal">
                              <li>
                                <p>Conversation depth</p>
                                <div className="flex items-center space-x-0.5">
                                  <p className="w-max">
                                    e.g. multiple followup questions
                                  </p>
                                  <p className="flex items-center space-x-0.5">
                                    <IconArrowRight className="size-3" />
                                    <span>+15</span>
                                  </p>
                                </div>
                              </li>
                              <li>
                                <p>Use of high-conversion keywords</p>
                                <div className="flex items-center space-x-0.5">
                                  <p className="w-max">
                                    e.g. pricing, subscribe
                                  </p>
                                  <p className="flex items-center space-x-0.5">
                                    <IconArrowRight className="size-3" />
                                    <span>+20</span>
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <p className="text-sm font-medium">70</p>
              </div>
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconMessages className="size-4" />
                  <p className="text-sm font-medium">Last Interaction</p>
                </div>
                <p className="text-sm font-medium">2 days ago</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="h-max w-full rounded-lg py-0">
          <CardTitle className="p-4 text-lg font-semibold">
            Chat Intelligence
          </CardTitle>
          <CardContent className="px-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconUsers className="size-4" />
                  <p className="text-sm font-medium">Segment Detected</p>
                </div>
                <p className="text-sm font-medium">22</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconTrendingUp className="size-4" />
                  <p className="text-sm font-medium">Topic Trend</p>
                </div>

                {isLoading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  <p className="text-sm font-medium">
                    {chatDetails?.topicTrend ?? "N/A"}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Bot size={17} />
                  <p className="text-sm font-medium">Bot Confidence</p>
                </div>

                {isLoading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  <p className="text-sm font-medium">
                    {chatDetails?.scorePercent != null
                      ? `${chatDetails.scorePercent}%`
                      : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-max w-full rounded-lg py-0">
          <CardTitle className="flex items-center justify-between p-4 text-lg font-semibold">
            Quick Notes
            <Button variant="ghost" className="h-7 w-7 p-0">
              <IconPlus className="size-4" />
            </Button>
          </CardTitle>
          <CardContent className="space-y-3 px-4 pb-5">
            <Card className="h-max w-full rounded-lg border-2 border-dashed py-0">
              <CardTitle className="flex items-center justify-between p-2 text-lg font-semibold text-zinc-400">
                <IconBellRinging className="size-4" />
                <Button variant="ghost" className="h-7 w-7 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </CardTitle>
              <CardContent className="px-2 pb-2.5">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium">
                    Callback scheduled with Alex
                  </p>
                  <p className="text-sm font-normal text-zinc-500">
                    Customer prefers voice call to finalise integration details
                    on May 12.
                  </p>
                  <p className="text-tiny font-normal text-zinc-400">
                    added by Emile John | April 12, 2025
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-max w-full rounded-lg border-2 border-dashed py-0">
              <CardTitle className="flex items-center justify-between p-2 text-lg font-semibold text-zinc-400">
                <IconBellRinging className="size-4" />
                <Button variant="ghost" className="h-7 w-7 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </CardTitle>
              <CardContent className="px-2 pb-2.5">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium">
                    Callback scheduled with Alex
                  </p>
                  <p className="text-sm font-normal text-zinc-500">
                    Customer prefers voice call to finalise integration details
                    on May 12.
                  </p>
                  <p className="text-tiny font-normal text-zinc-400">
                    added by Emile John | April 12, 2025
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
