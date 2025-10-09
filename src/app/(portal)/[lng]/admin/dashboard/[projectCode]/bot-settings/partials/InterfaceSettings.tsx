"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence } from "motion/react"
import ChatInterfaceStyles from "./ChatInterfaceStyles"
import { useState } from "react"
import { ContentForm, InterfaceSettingsTypes } from "@/types/botSettings"
import ChatInterfaceContent from "./ChatInterfaceContent"

interface InterfaceSettingsProps extends InterfaceSettingsTypes {
  setContentPreview: (data: ContentForm) => void
}

const InterfaceSettings = ({
  setBrandStyling,
  setChatButtonStyling,
  setWelcomeScreenStyling,
  setContentPreview
}: InterfaceSettingsProps) => {
  const [tab, setTab] = useState("content")

  const tabVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <Tabs
      orientation="vertical"
      value={tab}
      onValueChange={setTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>

      <Separator />

      <AnimatePresence mode="sync" initial={false}>
        {tab === "content" && (
          <ChatInterfaceContent
            key="content"
            tabVariants={tabVariants}
            setContentPreview={setContentPreview}
          />
        )}
        {tab === "style" && (
          <ChatInterfaceStyles
            key="style"
            tabVariants={tabVariants}
            setBrandStyling={setBrandStyling}
            setChatButtonStyling={setChatButtonStyling}
            setWelcomeScreenStyling={setWelcomeScreenStyling}
          />
        )}
      </AnimatePresence>
    </Tabs>
  )
}

export default InterfaceSettings
