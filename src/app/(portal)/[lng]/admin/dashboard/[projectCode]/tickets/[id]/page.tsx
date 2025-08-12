"use client"

import ChatConversation from "@/components/layout/conversation/ChatConversation"
import ChatInfo from "@/components/layout/conversation/ChatInfo"
import { JSX } from "react"

export default function TicketsChatViewPage(): JSX.Element {
  return (
    <div className="flex max-h-[calc(100vh-96px)] flex-1 flex-col space-y-8 overflow-auto md:space-y-2 md:overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-2">
      <div className="w-full">
        <ChatConversation isViewOnly />
      </div>
      <aside className="lg:max-w-80">
        <ChatInfo />
      </aside>
    </div>
  )
}
