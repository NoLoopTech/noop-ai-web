"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TabWebsite from "./tab-contents/TabWebsite"
import TabFiles from "./tab-contents/TabFiles"
import TabText from "./tab-contents/TabText"
import TabQAndA from "./tab-contents/TabQAndA"
import TabSocialMedia from "./tab-contents/TabSocialMedia"

interface TabContainerProps {
  isTrainedSourcesLoading: boolean
}

const tabContentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

const TabContainer = ({ isTrainedSourcesLoading }: TabContainerProps) => {
  const [activeTab, setActiveTab] = useState("website")

  return (
    <div className="flex h-[calc(100vh-13.7rem)] w-full items-start justify-between">
      <Tabs
        className="flex h-full w-full space-x-10"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
      >
        <TabsList className="flex h-max w-52 flex-col space-y-1.5 bg-transparent p-0">
          <TabsTrigger
            value="website"
            className="bg-background flex w-full items-center justify-start rounded-md stroke-none px-4 py-1.5 text-left text-zinc-600 hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-zinc-200 data-[state=active]:stroke-none data-[state=active]:text-zinc-600 data-[state=active]:shadow-none dark:text-zinc-300 dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-800"
          >
            <p>Website</p>
          </TabsTrigger>

          <TabsTrigger
            value="files"
            disabled={isTrainedSourcesLoading}
            className="bg-background flex w-full items-center justify-start rounded-md stroke-none px-4 py-1.5 text-left text-zinc-600 hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-zinc-200 data-[state=active]:stroke-none data-[state=active]:text-zinc-600 data-[state=active]:shadow-none dark:text-zinc-300 dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-800"
          >
            <p>Files</p>
          </TabsTrigger>

          <TabsTrigger
            value="text"
            disabled={isTrainedSourcesLoading}
            className="bg-background flex w-full items-center justify-start rounded-md stroke-none px-4 py-1.5 text-left text-zinc-600 hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-zinc-200 data-[state=active]:stroke-none data-[state=active]:text-zinc-600 data-[state=active]:shadow-none dark:text-zinc-300 dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-800"
          >
            <p>Text</p>
          </TabsTrigger>

          <TabsTrigger
            value="qanda"
            disabled={isTrainedSourcesLoading}
            className="bg-background flex w-full items-center justify-start rounded-md stroke-none px-4 py-1.5 text-left text-zinc-600 hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-zinc-200 data-[state=active]:stroke-none data-[state=active]:text-zinc-600 data-[state=active]:shadow-none dark:text-zinc-300 dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-800"
          >
            <p>Q&A</p>
          </TabsTrigger>

          <TabsTrigger
            value="socialmedia"
            disabled
            className="bg-background flex w-full items-center justify-start rounded-md stroke-none px-4 py-1.5 text-left text-zinc-600 hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-zinc-200 data-[state=active]:stroke-none data-[state=active]:text-zinc-600 data-[state=active]:shadow-none dark:text-zinc-300 dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-800"
          >
            <p>Social media</p>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {isTrainedSourcesLoading ? (
            <div className="flex h-40 w-full items-center justify-center">
              <p className="shine-text">Loading...</p>
            </div>
          ) : (
            <div className="w-full">
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
            </div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

export default TabContainer
