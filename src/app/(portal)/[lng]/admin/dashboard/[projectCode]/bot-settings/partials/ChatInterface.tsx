"use client"

import { useState } from "react"
import ChatPreview from "./ChatPreview"
import InterfaceSettings from "./InterfaceSettings"

const ChatInterface = () => {
  const [brandStyling, setBrandStyling] = useState({
    backgroundColor: "#1E50EF",
    color: "#FFFFFF",
    brandLogo: null as string | null
  })
  const [chatButtonStyling, setChatButtonStyling] = useState({
    backgroundColor: "#FAAA18",
    borderColor: "#FAAA18",
    chatButtonIcon: null as string | null
  })

  return (
    <>
      {/* Chat Interface */}
      <div className="bg-background flex-1 space-y-4 p-4">
        <h2 className="text-xl font-semibold">Chat Interface</h2>
        <InterfaceSettings
          setBrandStyling={setBrandStyling}
          setChatButtonStyling={setChatButtonStyling}
        />
      </div>

      {/* Bot preview */}
      <div className="border-muted/50 relative w-[510px] space-y-4 overflow-hidden border-l bg-zinc-600 bg-[url(/assets/images/bot-settings-preview-bg.png)] bg-cover bg-center px-20 py-4">
        <ChatPreview
          brandStyling={brandStyling}
          chatButtonStyling={chatButtonStyling}
        />
      </div>
    </>
  )
}

export default ChatInterface
