"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "motion/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconAlertTriangle,
  IconFilter2Question,
  IconInfoCircle,
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
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { useApiMutation, useApiQuery } from "@/query"
import { ONBOARDING_CHATBOT_CODE_KEY } from "./hooks/useClaimAgentAfterAuth"

const tabContentVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  exit: { opacity: 0, y: 30 }
}

interface TrainAgentRequest {
  chatBotCode: string
  webUrls?: string[]
  filePaths?: string[]
  cleanText?: string
  qaPairs?: Array<{ question: string; answer: string }>
  textTitleTextPairs?: Array<{ textTitle: string; text: string }>
}

interface CreateProjectResponse {
  chatBotCode: string
  projectName: string
  projectApiKey: string
  status: string
}

interface TrainAgentResponse {
  chatBotCode: string
  projectName: string
  projectCode: string
  status: string
}

interface AgentStatusResponse {
  status: string
  agentPrompt?: string | null
}

const normalizeStatus = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState("website")
  const {
    setStep,
    showUrlWarning,
    websiteLinks,
    files,
    textSources,
    qAndAs,
    socialMedia,
    chatBotCode,
    setChatBotCode,
    setAgentName,
    setAgentPrompt
  } = useOnboardingStore()

  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false)
  const [isTrainedDialogOpen, setIsTrainedDialogOpen] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isPollingStatus, setIsPollingStatus] = useState(false)

  const hasSources =
    websiteLinks.length > 0 ||
    files.length > 0 ||
    textSources.length > 0 ||
    qAndAs.length > 0 ||
    socialMedia.length > 0

  const selectedWebUrls = useMemo(
    () => websiteLinks.filter(l => l.selected).map(l => l.url),
    [websiteLinks]
  )

  useEffect(() => {
    const hasOtherSources =
      files.length > 0 ||
      textSources.length > 0 ||
      qAndAs.length > 0 ||
      socialMedia.length > 0

    const requiresWebsiteLinkSelection =
      websiteLinks.length > 0 && !hasOtherSources

    const hasValidWebsiteLinksSelection =
      !requiresWebsiteLinkSelection || websiteLinks.some(link => link.selected)

    const urlWarningBlocksTraining =
      showUrlWarning && !hasOtherSources && websiteLinks.length > 0

    if (
      hasSources &&
      hasValidWebsiteLinksSelection &&
      !urlWarningBlocksTraining
    ) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [
    hasSources,
    showUrlWarning,
    websiteLinks,
    files,
    textSources,
    qAndAs,
    socialMedia
  ])

  const createProjectMutation = useApiMutation<CreateProjectResponse, void>(
    "/onboarding/create-project",
    "post"
  )

  const uploadFileMutation = useApiMutation<
    { uploadUrl: string; publicUrl: string },
    { fileName: string; contentType?: string; folder?: string }
  >("/onboarding/upload-file", "post")

  const trainAgentMutation = useApiMutation<
    TrainAgentResponse,
    TrainAgentRequest
  >("/onboarding/train-agent", "post", {
    onSuccess: data => {
      setChatBotCode(data.chatBotCode)
      setAgentName(data.projectName)

      if (typeof window !== "undefined") {
        sessionStorage.setItem(ONBOARDING_CHATBOT_CODE_KEY, data.chatBotCode)
      }

      setIsPollingStatus(true)
      setIsTrainingDialogOpen(true)
    },
    onError: () => {
      setIsPollingStatus(false)
      setIsTrainingDialogOpen(false)
      setIsButtonDisabled(false)
    }
  })

  const agentStatusQuery = useApiQuery<AgentStatusResponse>(
    ["onboarding-agent-status", chatBotCode],
    "/onboarding/agent-status",
    () => ({
      method: "get",
      params: { chatBotCode }
    }),
    {
      enabled: Boolean(chatBotCode) && isPollingStatus,
      retry: 0,
      refetchInterval: query => {
        const status = normalizeStatus(query.state.data?.status)
        if (!status) return 2000
        if (status === "completed") return false
        if (status === "failed") return false
        return 2000
      },
      refetchIntervalInBackground: true
    }
  )

  useEffect(() => {
    const status = normalizeStatus(agentStatusQuery.data?.status)
    if (!status) return

    if (status === "completed") {
      setIsPollingStatus(false)
      setIsTrainingDialogOpen(false)
      setIsTrainedDialogOpen(true)
      setIsButtonDisabled(false)
      setAgentPrompt(agentStatusQuery.data?.agentPrompt ?? null)
      return
    }

    if (status === "failed") {
      setIsPollingStatus(false)
      setIsTrainingDialogOpen(false)
      setIsButtonDisabled(false)
      setChatBotCode(null)
      setAgentPrompt(null)

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(ONBOARDING_CHATBOT_CODE_KEY)
      }
    }
  }, [
    agentStatusQuery.data?.status,
    agentStatusQuery.data?.agentPrompt,
    setChatBotCode,
    setAgentPrompt
  ])

  const handleTrainClick = () => {
    if (isButtonDisabled) return
    ;(async () => {
      try {
        setIsButtonDisabled(true)
        setIsTrainedDialogOpen(false)
        setIsTrainingDialogOpen(true)
        setIsPollingStatus(false)

        if (typeof window !== "undefined") {
          sessionStorage.removeItem(ONBOARDING_CHATBOT_CODE_KEY)
        }

        const createResp = await createProjectMutation.mutateAsync()
        const { chatBotCode, projectName } = createResp
        if (!chatBotCode)
          throw new Error("Failed to obtain chatBotCode from server")
        setChatBotCode(chatBotCode)
        setAgentName(projectName)

        const storeFiles = useOnboardingStore.getState().files || []
        let uploadedFileUrls: string[] | undefined = undefined
        if (storeFiles.length > 0) {
          const folderName = chatBotCode
          const uploadPromises = storeFiles.map(f =>
            (async () => {
              if (!f.raw) return null
              const resp = await uploadFileMutation.mutateAsync({
                fileName: f.name,
                contentType: f.raw.type || "application/octet-stream",
                folder: folderName
              })
              const { uploadUrl, publicUrl } = resp
              await axios.put(uploadUrl, f.raw, {
                headers: {
                  "x-ms-blob-type": "BlockBlob",
                  "Content-Type": f.raw.type || "application/octet-stream"
                }
              })
              return publicUrl
            })()
          )
          const settled = await Promise.allSettled(uploadPromises)
          const successful = settled
            .filter(
              (r): r is PromiseFulfilledResult<string | null> =>
                r.status === "fulfilled"
            )
            .map(r => r.value)
            .filter(Boolean) as string[]
          uploadedFileUrls = successful.length > 0 ? successful : undefined
        }

        const finalPayload: TrainAgentRequest = {
          chatBotCode,
          webUrls: selectedWebUrls.length > 0 ? selectedWebUrls : undefined,
          textTitleTextPairs:
            textSources.length > 0
              ? textSources.map(t => ({
                  textTitle: t.title,
                  text: t.description
                }))
              : undefined,
          qaPairs:
            qAndAs.length > 0
              ? qAndAs.map(q => ({ question: q.question, answer: q.answer }))
              : undefined,
          filePaths: uploadedFileUrls
        }

        trainAgentMutation.mutate(finalPayload)
      } catch (_error) {
        setIsPollingStatus(false)
        setIsTrainingDialogOpen(false)
        setIsButtonDisabled(false)
      }
    })()
  }

  const handleGoToPlayground = () => {
    setIsTrainedDialogOpen(false)
    setStep(OnboardingSteps.PLAYGROUND)
  }

  const handleTrainingDialogOpenChange = (open: boolean) => {
    setIsTrainingDialogOpen(open)

    if (!open) {
      setIsPollingStatus(false)
    }
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
              className="flex space-x-2 rounded-md border border-zinc-200 bg-white stroke-[#FFB700] px-4 py-1.5 text-[#52525B] focus-visible:ring-1 focus-visible:ring-zinc-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#15A4A7] data-[state=active]:to-[#08C4C8] data-[state=active]:stroke-white data-[state=active]:text-white"
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
              disabled
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
              {/* Show empty state if no sources are selected */}
              {!hasSources ? (
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-zinc-200 px-2.5 py-3 shadow-xs">
                  <IconAlertTriangle className="size-5 stroke-zinc-500" />

                  <p className="text-center text-xs font-normal text-zinc-500">
                    Your sources will show up here—try pasting a link or
                    uploading a file to begin.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex w-full flex-col space-y-2">
                    {showUrlWarning ? (
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                        <span className="flex h-full w-5/12 bg-gradient-to-r from-[#DA0000] to-[#FF0101] transition-all duration-700 ease-in-out"></span>
                      </div>
                    ) : (
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                        <span className="flex h-full w-8/12 bg-gradient-to-r from-[#0736F0] to-[#0088FF] transition-all duration-700 ease-in-out"></span>
                      </div>
                    )}

                    {showUrlWarning ? (
                      <p className="shine-text text-xs font-medium">
                        Training unavailable
                      </p>
                    ) : (
                      <p className="shine-text text-xs font-medium">
                        Your agent is getting smarter…
                      </p>
                    )}
                  </div>

                  <ScrollArea className="h-[130px] w-full pr-2.5">
                    <div className="flex flex-col space-y-2">
                      {/* Website Links */}
                      {websiteLinks.length > 0 && (
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <IconWorld className="size-4 stroke-zinc-600" />

                            <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                              <p className="text-left text-sm font-normal text-zinc-600">
                                {
                                  websiteLinks.filter(link => link.selected)
                                    .length
                                }
                              </p>

                              <p className="text-sm font-normal text-zinc-600">
                                Links
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 text-xs font-semibold text-zinc-700">
                            <p>TBD</p>
                            <IconInfoCircle className="mt-0.5 size-3.5 stroke-zinc-400" />
                          </div>
                        </div>
                      )}

                      {/* Files */}
                      {files.length > 0 && (
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="size-4 stroke-zinc-600" />

                            <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                              <p className="text-left text-sm font-normal text-zinc-600">
                                {files.length}
                              </p>

                              <p className="text-sm font-normal text-zinc-600">
                                Files
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                            <p>
                              {files
                                .reduce(
                                  (acc, curr) => acc + curr.size / 1024,
                                  0
                                )
                                .toFixed(3)}
                            </p>
                            <p>KB</p>
                          </div>
                        </div>
                      )}

                      {/* Text Sources */}
                      {textSources.length > 0 && (
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="size-4 stroke-zinc-600" />

                            <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                              <p className="text-left text-sm font-normal text-zinc-600">
                                {textSources.length}
                              </p>

                              <p className="text-sm font-normal text-zinc-600">
                                Text
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                            <p>
                              {textSources
                                .reduce(
                                  (acc, curr) => acc + curr.size / 1024,
                                  0
                                )
                                .toFixed(3)}
                            </p>
                            <p>KB</p>
                          </div>
                        </div>
                      )}

                      {/* Q&A */}
                      {qAndAs.length > 0 && (
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <IconFilter2Question className="size-4 stroke-zinc-600" />

                            <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                              <p className="text-left text-sm font-normal text-zinc-600">
                                {qAndAs.length}
                              </p>

                              <p className="text-sm font-normal text-zinc-600">
                                Q&A
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                            <p>25</p>
                            <p>KB</p>
                          </div>
                        </div>
                      )}

                      {/* Social Media */}
                      {socialMedia.length > 0 && (
                        <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <IconWorldHeart className="size-4 stroke-zinc-600" />

                            <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                              <p className="text-left text-sm font-normal text-zinc-600">
                                {socialMedia.length}
                              </p>

                              <p className="text-sm font-normal text-zinc-600">
                                Social Media
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                            <p>25</p>
                            <p>KB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}

              <div className="flex justify-between rounded-lg border border-zinc-200/90 bg-zinc-50 px-3 py-2">
                <p className="text-sm font-normal text-zinc-700">Total size</p>
                <div className="flex items-center space-x-0.5 text-sm font-semibold text-zinc-700">
                  <div className="flex items-center">
                    <p>0</p>
                    <p>KB</p>
                  </div>

                  <p>/</p>

                  <div className="flex items-center">
                    <p>400</p>
                    <p>KB</p>
                  </div>
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
      <AlertDialog
        open={isTrainingDialogOpen}
        onOpenChange={handleTrainingDialogOpenChange}
      >
        <AlertDialogContent>
          {/* Add visually screen reader only title & description for accessibility. without AlertDialogTitle it shows a error */}
          <div className="sr-only">
            <AlertDialogTitle>Bot is learning dialog</AlertDialogTitle>
            <AlertDialogDescription>
              Your agent is being trained on the knowledge you provided—this
              usually takes just a moment.
            </AlertDialogDescription>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src="/assets/icons/onboarding-bot-is-learning-dialog-icon.png"
              alt="loading icon"
              width={95}
              height={96}
            />

            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <h3 className="shine-text text-lg font-semibold text-zinc-950">
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
      <AlertDialog
        open={isTrainedDialogOpen}
        onOpenChange={setIsTrainedDialogOpen}
      >
        <AlertDialogContent className="py-5">
          {/* Add visually screen reader only title & description for accessibility. without AlertDialogTitle it shows a error */}
          <div className="sr-only">
            <AlertDialogTitle>Bot is alive dialog</AlertDialogTitle>
            <AlertDialogDescription>
              Your intelligent agent is live in the playground.
            </AlertDialogDescription>
          </div>

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
