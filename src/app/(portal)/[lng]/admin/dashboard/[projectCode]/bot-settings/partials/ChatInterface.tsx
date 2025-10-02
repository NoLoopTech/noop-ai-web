"use client"

import { useState } from "react"
import ChatPreview from "./ChatPreview"
import InterfaceSettings from "./InterfaceSettings"
import { ChatStylePreviewType } from "@/types/botSettings"

const ChatInterface = () => {
  const [brandStyling, setBrandStyling] = useState<
    ChatStylePreviewType["brandStyling"]
  >({
    backgroundColor: "#1E50EF",
    color: "#FFFFFF",
    brandLogo: null
  })
  const [chatButtonStyling, setChatButtonStyling] = useState<
    ChatStylePreviewType["chatButtonStyling"]
  >({
    backgroundColor: "#F4F4F5",
    borderColor: "#F4F4F5",
    chatButtonTextColor: "#71717b",
    chatButtonIcon: null,
    chatButtonPosition: "right"
  })
  const [welcomeScreenStyling, setWelcomeScreenStyling] = useState<
    ChatStylePreviewType["welcomeScreenStyling"]
  >({
    welcomeScreenAppearance: "half_background",
    welcomeButtonBgColor: "#1E50EF",
    welcomeButtonTextColor: "#1E50EF"
  })

  return (
    <>
      {/* Chat Interface */}
      <div className="bg-background flex-1 space-y-4 p-4">
        <h2 className="text-xl font-semibold">Chat Interface</h2>
        <InterfaceSettings
          setBrandStyling={setBrandStyling}
          setChatButtonStyling={setChatButtonStyling}
          setWelcomeScreenStyling={setWelcomeScreenStyling}
        />
      </div>

      {/* Bot preview */}
      <div className="border-muted/50 relative w-[510px] space-y-4 overflow-hidden border-l bg-zinc-600 bg-[url(/assets/images/bot-settings-preview-bg.png)] bg-cover bg-center px-20 py-4">
        <ChatPreview
          brandStyling={brandStyling}
          chatButtonStyling={chatButtonStyling}
          welcomeScreenStyling={welcomeScreenStyling}
        />
      </div>
    </>
  )
}

export default ChatInterface
