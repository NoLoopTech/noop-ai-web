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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent
} from "@/components/ui/alert-dialog"
import Image from "next/image"

const tabContentVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  exit: { opacity: 0, y: 30 }
}

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState("website")

  const websiteLinks = useOnboardingStore(s => s.websiteLinks)
  const setStep = useOnboardingStore(s => s.setStep)

  // dialog states
  const [loadingOpen, setLoadingOpen] = useState(false)
  const [loadedOpen, setLoadedOpen] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleTrainClick = () => {
    if (isButtonDisabled) return
    setIsButtonDisabled(true)
    setLoadingOpen(true)

    // simulate API call
    setTimeout(() => {
      setLoadingOpen(false)
      setLoadedOpen(true)
      setIsButtonDisabled(false)
    }, 2000)
  }

  const handleGoToPlayground = () => {
    setLoadedOpen(false)
    setStep(OnboardingSteps.PLAYGROUND)
  }

  return (
    <div className="relative flex h-[calc(100vh-12.2rem)] w-full items-start justify-between space-x-12">
      <div className="w-full">
        <Tabs
          className="w-full"
          defaultValue={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="absolute flex w-full space-x-6 bg-white">
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
            <div className="pt-12">
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
          </AnimatePresence>
        </Tabs>
      </div>

      <div className="mt-16 w-96 max-w-96">
        <Card className="p-0">
          <CardHeader className="p-3 pb-1.5">
            <CardTitle className="text-lg font-semibold text-zinc-950">
              Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="flex flex-col space-y-4">
              {/* INFO: to use when functionality is implemented */}
              {/* <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-zinc-200 px-2.5 py-3 shadow-xs">
                <IconAlertTriangle className="size-5 stroke-zinc-500" />

                <p className="text-center text-xs font-normal text-zinc-500">
                  Your sources will show up here—try pasting a link or uploading
                  a file to begin.
                </p>
              </div> */}

              <div className="flex w-full flex-col space-y-2">
                {/* INFO: warning version */}
                {/* <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <span className="flex h-full w-5/12 bg-gradient-to-r from-[#DA0000] to-[#FF0101]"></span>
                </div> */}

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <span className="flex h-full w-8/12 bg-gradient-to-r from-[#0736F0] to-[#0088FF]"></span>
                </div>

                <p className="shine-text text-xs font-medium">
                  Your agent is getting smarter…
                </p>
              </div>

              <ScrollArea className="h-[130px] w-full pr-2.5">
                <div className="flex flex-col space-y-2">
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <IconWorld className="size-4 stroke-zinc-600" />

                      <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                        <p className="text-left text-sm font-normal text-zinc-600">
                          {websiteLinks.filter(link => link.selected).length}
                        </p>

                        <p className="text-sm font-normal text-zinc-600">
                          Links
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                      <p>25</p>
                      <p>KB</p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="size-4 stroke-zinc-600" />

                      <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                        <p className="text-left text-sm font-normal text-zinc-600">
                          0
                        </p>

                        <p className="text-sm font-normal text-zinc-600">
                          Text
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                      <p>25</p>
                      <p>KB</p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <IconFilter2Question className="size-4 stroke-zinc-600" />

                      <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                        <p className="text-left text-sm font-normal text-zinc-600">
                          0
                        </p>

                        <p className="text-sm font-normal text-zinc-600">Q&A</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                      <p>25</p>
                      <p>KB</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex justify-between rounded-lg border border-zinc-200/90 bg-zinc-50 px-3 py-2">
                <p className="text-sm font-normal text-zinc-700">Total size</p>
                <div className="flex space-x-1 text-sm font-semibold text-zinc-700">
                  <p>0</p>
                  <p>KB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex w-full">
          <Button
            onClick={handleTrainClick}
            className="w-full bg-[#1E50EF] p-3 hover:bg-[#1E50EF]/80"
            disabled={isButtonDisabled}
          >
            Train agent
          </Button>
        </div>
      </div>

      {/* Bot is learning dialog (no buttons) */}
      <AlertDialog open={loadingOpen} onOpenChange={setLoadingOpen}>
        <AlertDialogContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src="/assets/icons/onboarding-bot-is-learning-dialog-icon.png"
              alt="loading icon"
              width={95}
              height={96}
            />

            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <h3 className="text-lg font-semibold text-zinc-950">
                Your agent is learning right now.
              </h3>
              <p className="text-sm font-medium text-zinc-500">
                Your agent is being trained on the knowledge you provided—this
                usually takes just a moment.
              </p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Agent is alive dialog (single "Go to Playground" button) */}
      <AlertDialog open={loadedOpen} onOpenChange={setLoadedOpen}>
        <AlertDialogContent className="py-5">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src="/assets/icons/onboarding-bot-is-live-dialog-icon.png"
              alt="loading icon"
              width={84}
              height={74}
            />

            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <h3 className="text-lg font-semibold text-zinc-950">
                Your intelligent agent is live in the playground
              </h3>
              <p className="text-sm font-medium text-zinc-500">
                Test it out, ask questions, and shape its personality
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <AlertDialogAction
              onClick={handleGoToPlayground}
              className="w-max bg-[#1E50EF] p-3 hover:bg-[#1E50EF]/80"
            >
              Go to Playground
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TabContainer
