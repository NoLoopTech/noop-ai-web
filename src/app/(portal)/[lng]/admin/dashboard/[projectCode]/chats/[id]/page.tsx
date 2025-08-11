"use client"

import ChatList from "./partials/ChatList"
import ChatConversation from "./partials/ChatConversation"
import ChatInfo from "./partials/ChatInfo"
import { JSX } from "react"

export default function SettingsGeneralPage(): JSX.Element {
  return (
    <div className="flex max-h-[calc(100vh-96px)] flex-1 flex-col space-y-8 overflow-auto md:space-y-2 md:overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-2">
      <aside className="lg:min-w-72">
        <ChatList />
      </aside>
      <div className="w-full">
        <ChatConversation />
      </div>
      <aside className="lg:min-w-80">
        <ChatInfo />
      </aside>
    </div>
  )
}
