"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconFilter2Question,
  IconWorld,
  IconWorldHeart
} from "@tabler/icons-react"
import { FileText, Type } from "lucide-react"
import TabWebsite from "./tab-contents/TabWebsite"
import TabFiles from "./tab-contents/TabFiles"
import TabText from "./tab-contents/TabText"
import TabQAndA from "./tab-contents/TabQAndA"
import TabSocialMedia from "./tab-contents/TabSocialMedia"

const tabContentVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  exit: { opacity: 0, y: 30 }
}

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState("website")

  return (
    <div className="my-6 flex w-full items-center justify-center">
      <Tabs
        defaultValue={activeTab}
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex space-x-6 bg-white">
          <TabsTrigger
            value="website"
            className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#52525B] px-4 py-1.5 text-[#52525B] focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
          >
            <IconWorld className="size-4 stroke-inherit" />
            <p>Website</p>
          </TabsTrigger>

          <TabsTrigger
            value="files"
            className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#5400AE] px-4 py-1.5 text-[#52525B] focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
          >
            <FileText className="size-4 stroke-inherit" />
            <p>Files</p>
          </TabsTrigger>

          <TabsTrigger
            value="text"
            className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#007E43] px-4 py-1.5 text-[#52525B] focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
          >
            <Type className="size-4 stroke-inherit" />
            <p>Text</p>
          </TabsTrigger>

          <TabsTrigger
            value="qanda"
            className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#0606B3] px-4 py-1.5 text-[#52525B] focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
          >
            <IconFilter2Question className="size-4 stroke-inherit" />
            <p>Q&A</p>
          </TabsTrigger>

          <TabsTrigger
            value="socialmedia"
            className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#B319A9] px-4 py-1.5 text-[#52525B] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
          >
            <IconWorldHeart className="size-4 stroke-inherit" />
            <p>Social media</p>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "website" && (
            <TabWebsite motionVariants={tabContentVariants} />
          )}

          {activeTab === "files" && (
            <TabFiles motionVariants={tabContentVariants} />
          )}

          {activeTab === "text" && (
            <TabText motionVariants={tabContentVariants} />
          )}

          {activeTab === "qanda" && (
            <TabQAndA motionVariants={tabContentVariants} />
          )}

          {activeTab === "socialmedia" && (
            <TabSocialMedia motionVariants={tabContentVariants} />
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

export default TabContainer
