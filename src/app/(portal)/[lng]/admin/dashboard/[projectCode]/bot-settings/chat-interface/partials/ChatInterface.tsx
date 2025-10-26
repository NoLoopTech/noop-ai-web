"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChatStylePreviewType, ContentForm } from "@/types/botSettings"
import { Button } from "@/components/ui/button"
import { useApiMutation, useApiQuery } from "@/query"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useSession } from "next-auth/react"
import { useToast } from "@/lib/hooks/useToast"
import InterfaceSettings from "./InterfaceSettings"
import ChatPreview from "./ChatPreview"

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

  const { data: botSettingsApiResponse, isLoading: isBotSettingsLoading } =
    useApiQuery<botSettingsResponse>(
      ["bot-settings-data"],
      `/botsettings/${projectId}`,
      () => ({
        method: "get"
      })
    )

  const stylingSettings = useMemo(() => {
    if (!botSettingsApiResponse) return

    const brand = botSettingsApiResponse.botSettings.brandStyling
    const chat = botSettingsApiResponse.botSettings.chatButtonStyling
    const welcome = botSettingsApiResponse.botSettings.welcomeScreenStyling

    return {
      themes: brand?.theme ?? "light",
      brandBgColor: brand?.backgroundColor ?? "#1E50EF",
      brandTextColor: brand?.color ?? "#FFFFFF",
      brandLogo: brand?.brandLogo ?? null,
      chatButtonBgColor: chat?.backgroundColor ?? "#F4F4F5",
      chatButtonTextColor: chat?.chatButtonTextColor ?? "#71717b",
      chatButtonBorderColor: chat?.borderColor ?? "#F4F4F5",
      chatButtonPosition: chat?.chatButtonPosition ?? "right",
      chatButtonIcon: chat?.chatButtonIcon ?? null,
      welcomeScreenAppearance:
        welcome?.welcomeScreenAppearance ?? "half_background",
      welcomeButtonBgColor: welcome?.welcomeButtonBgColor ?? "#1E50EF",
      welcomeButtonTextColor: welcome?.welcomeButtonTextColor ?? "#1E50EF"
    }
  }, [botSettingsApiResponse])

  const contentSettings = useMemo(() => {
    if (!botSettingsApiResponse) return

    return botSettingsApiResponse?.botSettings.contentPreview
  }, [botSettingsApiResponse])

  const brandLogoPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const chatButtonIconPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isChatIconCropping, setIsChatIconCropping] = useState(false)
  const [isBrandLogoCropping, setIsBrandLogoCropping] = useState(false)

  const [brandStyling, setBrandStyling] = useState<
    ChatStylePreviewType["brandStyling"]
  >({
    theme: "light",
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

  const [contentPreview, setContentPreview] = useState<
    ContentForm | undefined
  >()

  useEffect(() => {
    if (contentSettings) {
      setContentPreview({
        botName: contentSettings?.botName || "Noopy",
        initialMessage:
          contentSettings?.initialMessage || "How can I help you today?",
        messagePlaceholder:
          contentSettings?.messagePlaceholder || "How do I register to noopy?",
        dismissibleNotice: contentSettings?.dismissibleNotice || null,
        suggestedMessagesEnabled:
          contentSettings?.suggestedMessagesEnabled || false,
        suggestedMessages: contentSettings?.suggestedMessages || [],
        collectUserFeedbackEnabled:
          contentSettings?.collectUserFeedbackEnabled || false,
        regenerateMessagesEnabled:
          contentSettings?.regenerateMessagesEnabled || false,
        quickPromptsEnabled: contentSettings?.quickPromptsEnabled || false,
        quickPrompts: contentSettings?.quickPrompts || [
          { text: "👋 Hi! I am Noopy AI, ask me anything about Noopy!" },
          {
            text: "By the way, you can create an agent like me for your website!"
          }
        ],
        welcomeScreenEnabled: contentSettings?.welcomeScreenEnabled || false,
        welcomeScreen: contentSettings?.welcomeScreen || {
          title: "Almost Ready to Chat!",
          instructions: "Tell us who you are so Noopy can assist you better."
        }
      })
    }
  }, [contentSettings])

  useEffect(() => {
    if (!stylingSettings) return
    setBrandStyling({
      theme: stylingSettings.themes ?? "light",
      backgroundColor: stylingSettings.brandBgColor ?? "#1E50EF",
      color: stylingSettings.brandTextColor ?? "#FFFFFF",
      brandLogo: stylingSettings.brandLogo ?? null
    })
    setChatButtonStyling({
      backgroundColor: stylingSettings.chatButtonBgColor ?? "#F4F4F5",
      borderColor: stylingSettings.chatButtonBorderColor ?? "#F4F4F5",
      chatButtonTextColor: stylingSettings.chatButtonTextColor ?? "#71717b",
      chatButtonIcon: stylingSettings.chatButtonIcon ?? null,
      chatButtonPosition: stylingSettings.chatButtonPosition ?? "right"
    })
    setWelcomeScreenStyling({
      welcomeScreenAppearance:
        stylingSettings.welcomeScreenAppearance ?? "half_background",
      welcomeButtonBgColor: stylingSettings.welcomeButtonBgColor ?? "#1E50EF",
      welcomeButtonTextColor:
        stylingSettings.welcomeButtonTextColor ?? "#1E50EF"
    })
  }, [stylingSettings])

  useEffect(() => {
    const canvas = chatButtonIconPreviewCanvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx && typeof chatButtonStyling.chatButtonIcon === "string") {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = chatButtonStyling.chatButtonIcon
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.beginPath()
        const radius = Math.min(canvas.width, canvas.height) / 2
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        ctx.restore()
      }
    } else if (canvas && ctx && !chatButtonStyling.chatButtonIcon) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [chatButtonStyling.chatButtonIcon])

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
          contentSettings={contentSettings}
          stylingSettings={stylingSettings}
          isBotSettingsLoading={isBotSettingsLoading}
          brandLogoPreviewCanvasRef={brandLogoPreviewCanvasRef}
          chatButtonIconPreviewCanvasRef={chatButtonIconPreviewCanvasRef}
          setIsChatIconCropping={setIsChatIconCropping}
          setIsBrandLogoCropping={setIsBrandLogoCropping}
        />

        {!isBotSettingsLoading && (
          <div className="flex w-full items-center justify-end space-x-4 px-3">
            <p className="shine-text text-xs">
              {saveBotInterfaceSettings.isPending
                ? "Settings are being saved"
                : ""}
            </p>
            <Button
              type="button"
              variant="default"
              onClick={handleSave}
              disabled={saveBotInterfaceSettings.isPending}
              className="max-w-max min-w-24 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveBotInterfaceSettings.isPending ? "Saving" : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* Bot preview */}
      <div className="border-muted/50 relative flex h-[calc(100vh-64px)] w-[510px] items-center justify-center space-y-4 overflow-hidden border-l bg-zinc-600 bg-[url(/assets/images/bot-settings-preview-bg.png)] bg-cover bg-center px-20 py-4">
        <ChatPreview
          brandStyling={brandStyling}
          chatButtonStyling={chatButtonStyling}
          welcomeScreenStyling={welcomeScreenStyling}
          contentPreview={contentPreview}
          isBotSettingsLoading={isBotSettingsLoading}
          brandLogoPreviewCanvasRef={brandLogoPreviewCanvasRef}
          chatButtonIconPreviewCanvasRef={chatButtonIconPreviewCanvasRef}
          isChatIconCropping={isChatIconCropping}
          isBrandLogoCropping={isBrandLogoCropping}
        />
      </div>
    </>
  )
}

export default ChatInterface
