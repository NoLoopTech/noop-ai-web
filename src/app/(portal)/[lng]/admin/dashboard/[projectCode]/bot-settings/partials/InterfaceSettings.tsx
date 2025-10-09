"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence } from "motion/react"
import ChatInterfaceStyles from "./ChatInterfaceStyles"
import { useEffect, useState } from "react"
import {
  ContentForm,
  InterfaceSettingsTypes,
  StyleForm
} from "@/types/botSettings"
import ChatInterfaceContent from "./ChatInterfaceContent"
import { IconSettings } from "@tabler/icons-react"

interface InterfaceSettingsProps extends InterfaceSettingsTypes {
  setContentPreview: (data: ContentForm) => void
  contentSettings?: ContentForm | undefined
  stylingSettings?: StyleForm | undefined
  isBotSettingsLoading: boolean
}

const InterfaceSettings = ({
  setBrandStyling,
  setChatButtonStyling,
  setWelcomeScreenStyling,
  setContentPreview,
  contentSettings,
  stylingSettings,
  isBotSettingsLoading
}: InterfaceSettingsProps) => {
  const [tab, setTab] = useState("content")
  const [stylingFormUpdate, setStylingFormUpdate] = useState<
    StyleForm | undefined
  >()

  const tabVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  const defaultStylingSettings: StyleForm = {
    themes: "light",
    chatButtonIcon: undefined,
    chatButtonBorderColor: "#F4F4F5",
    chatButtonBgColor: "#F4F4F5",
    chatButtonTextColor: "#71717b",
    chatButtonPosition: "right",
    brandLogo: undefined,
    brandBgColor: "#1E50EF",
    brandTextColor: "#1E50EF",
    welcomeScreenAppearance: "half_background",
    welcomeButtonBgColor: "#1E50EF",
    welcomeButtonTextColor: "#1E50EF"
  }

  useEffect(() => {
    if (stylingSettings) {
      setStylingFormUpdate(stylingSettings)
    } else {
      setStylingFormUpdate(defaultStylingSettings)
    }
  }, [stylingSettings])

  return (
    <Tabs
      orientation="vertical"
      value={tab}
      onValueChange={setTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger disabled={isBotSettingsLoading} value="style">
          Style
        </TabsTrigger>
      </TabsList>

      <Separator />

      {isBotSettingsLoading ? (
        <div className="relative flex h-80 w-full flex-col items-center justify-center space-y-5 py-4 text-gray-500 dark:text-gray-600">
          <IconSettings className="h-24 w-24 animate-spin stroke-[0.5] duration-[3500ms]" />
          <p className="shine rounded-md px-4 py-2">
            Settings are being loaded...
          </p>
        </div>
      ) : (
        <AnimatePresence mode="sync" initial={false}>
          {tab === "content" && (
            <ChatInterfaceContent
              key="content"
              tabVariants={tabVariants}
              setContentPreview={setContentPreview}
              contentSettings={contentSettings}
            />
          )}
          {tab === "style" && (
            <ChatInterfaceStyles
              key="style"
              tabVariants={tabVariants}
              setBrandStyling={setBrandStyling}
              setChatButtonStyling={setChatButtonStyling}
              setWelcomeScreenStyling={setWelcomeScreenStyling}
              stylingSettings={stylingFormUpdate}
            />
          )}
        </AnimatePresence>
      )}
    </Tabs>
  )
}

export default InterfaceSettings
