"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { Session } from "../data/schema"
import { Row } from "@tanstack/react-table"
import {
  IconFileDescription
  //   IconEyeDotted,
  //   IconMessage2Search
} from "@tabler/icons-react"

interface Props {
  row: Row<Session>
}

export function SessionsSummaryAction({ row }: Props) {
  const session = row.original
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <IconFileDescription className="h-5 w-5 cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="max-w-80">
          <p className="text-sm font-normal">
            {session.chatSummary || "No summary available"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
