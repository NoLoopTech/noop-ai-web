"use client"

import { useState } from "react"
import ChatPreview from "./ChatPreview"
import InterfaceSettings from "./InterfaceSettings"
import { ChatStylePreviewType, ContentForm } from "@/types/botSettings"
import { Button } from "@/components/ui/button"
import { useApiMutation, useApiQuery } from "@/query"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useSession } from "next-auth/react"
import { useToast } from "@/lib/hooks/useToast"

interface botSettingsResponse {
  botSettings: {
    brandStyling: ChatStylePreviewType["brandStyling"]
    chatButtonStyling: ChatStylePreviewType["chatButtonStyling"]
    welcomeScreenStyling: ChatStylePreviewType["welcomeScreenStyling"]
    contentPreview: ContentForm
  }
}

const ChatInterface = () => {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const token = session?.apiToken
  const projectId = useProjectCode()

  const { data: botSettingsApiResponse } = useApiQuery<botSettingsResponse>(
    ["bot-settings"],
    `/botsettings/${projectId}`,
    () => ({
      method: "get"
    })
  )

  // TODO: Remove console log on next PR
  // eslint-disable-next-line no-console
  console.log("botSettingsApiResponsefghfghfgh", botSettingsApiResponse)

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

  const [contentPreview, setContentPreview] = useState<ContentForm | undefined>(
    {
      botName: "",
      initialMessage: "How can I help you today?",
      messagePlaceholder: "How do I register to noopy?",
      dismissibleNotice: null,
      suggestedMessagesEnabled: false,
      suggestedMessages: [],
      collectUserFeedbackEnabled: false,
      regenerateMessagesEnabled: false,
      quickPromptsEnabled: false,
      quickPrompts: [
        { text: "👋 Hi! I am Noopy AI, ask me anything about Noopy!" },
        {
          text: "By the way, you can create an agent like me for your website!"
        }
      ],
      welcomeScreenEnabled: false,
      welcomeScreen: {
        title: "Almost Ready to Chat!",
        instructions: "Tell us who you are so Noopy can assist you better."
      }
    }
  )

  const saveBotInterfaceSettings = useApiMutation(
    projectId ? `/botsettings/save/${projectId}` : "",
    "post",
    {
      onSuccess: () => {
        toast({
          title: "Bot settings saved successfully!",
          variant: "success",
          duration: 4000
        })
      },
      onError: error => {
        if (status !== "authenticated" || !token) return
        const errorMessage =
          (error as { message?: string })?.message ||
          "An error occurred while saving settings."
        toast({
          title: "Failed to save settings!",
          description: errorMessage,
          variant: "error",
          duration: 4000
        })
      }
    }
  )

  const handleSave = () => {
    const botSettings = {
      botSettings: {
        brandStyling,
        chatButtonStyling,
        welcomeScreenStyling,
        contentPreview
      }
    }

    saveBotInterfaceSettings.mutate(botSettings)
  }

  return (
    <>
      {/* Chat Interface - content/styles */}
      <div className="bg-background flex-1 space-y-4 p-4">
        <h2 className="text-xl font-semibold">Chat Interface</h2>

        <InterfaceSettings
          setBrandStyling={setBrandStyling}
          setChatButtonStyling={setChatButtonStyling}
          setWelcomeScreenStyling={setWelcomeScreenStyling}
          setContentPreview={setContentPreview}
        />

        <div className="flex w-full items-center justify-end px-3">
          <Button
            type="submit"
            variant="default"
            onClick={handleSave}
            className="w-max disabled:opacity-50"
            form="chat-interface-content"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Bot preview */}
      <div className="border-muted/50 relative flex h-[calc(100vh-64px)] w-[510px] items-center justify-center space-y-4 overflow-hidden border-l bg-zinc-600 bg-[url(/assets/images/bot-settings-preview-bg.png)] bg-cover bg-center px-20 py-4">
        <ChatPreview
          brandStyling={brandStyling}
          chatButtonStyling={chatButtonStyling}
          welcomeScreenStyling={welcomeScreenStyling}
          contentPreview={contentPreview}
        />
      </div>
    </>
  )
}

export default ChatInterface
