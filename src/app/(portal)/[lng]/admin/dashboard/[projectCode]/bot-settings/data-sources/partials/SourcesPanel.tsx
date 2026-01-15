"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconFilter2Question,
  IconInfoCircle,
  IconWorld,
  IconWorldHeart
} from "@tabler/icons-react"
import { FileText, Type } from "lucide-react"
import { useBotSettingsFileSourcesStore } from "../store/botSettingsFileSources.store"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useProjectCodeString } from "@/lib/hooks/useProjectCode"
import { useApiMutation, useApiQuery } from "@/query"
import axios from "axios"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

interface SourcesPanelProps {
  isTrainedSourcesLoading: boolean
}

interface AgentRequest {
  chatBotCode: string
  baseUrl?: { protocol: "http://" | "https://"; domain: string }
  webUrls?: string[]
  filePaths?: string[]
  cleanText?: string
  qaPairs?: Array<{ qAndATitle: string; question: string; answer: string }>
  textTitleTextPairs?: Array<{ textTitle: string; text: string }>
}

interface AgentResponse {
  chatBotCode: string
  projectName: string
  projectCode: string
  status: string
}

interface AgentStatusResponse {
  status: string
}

const normalizeStatus = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()

const SourcesPanel = ({ isTrainedSourcesLoading }: SourcesPanelProps) => {
  const {
    showUrlWarning,
    baseUrl,
    websiteLinks,
    files,
    trainedPublicFileUrls,
    textSources,
    qAndAs,
    socialMedia
  } = useBotSettingsFileSourcesStore()

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

  const chatBotCode = useProjectCodeString()

  const uploadFileMutation = useApiMutation<
    { uploadUrl: string; publicUrl: string },
    { fileName: string; contentType?: string; folder?: string }
  >("/botSettings/upload-file", "post")

  const trainAgentMutation = useApiMutation<AgentResponse, AgentRequest>(
    "/botSettings/update-agent",
    "post",
    {
      onSuccess: () => {
        setIsPollingStatus(true)
        setIsTrainingDialogOpen(true)
      },
      onError: () => {
        setIsPollingStatus(false)
        setIsTrainingDialogOpen(false)
        setIsButtonDisabled(false)
      }
    }
  )

  const agentStatusQuery = useApiQuery<AgentStatusResponse>(
    ["botSettings-agent-status", chatBotCode],
    `/botSettings/${chatBotCode}/agent-status`,
    () => ({
      method: "get"
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
      return
    }

    if (status === "failed") {
      setIsPollingStatus(false)
      setIsTrainingDialogOpen(false)
      setIsButtonDisabled(false)
    }
  }, [agentStatusQuery.data?.status])

  const handleTrainClick = () => {
    ;(async () => {
      try {
        setIsButtonDisabled(true)
        setIsTrainedDialogOpen(false)
        setIsTrainingDialogOpen(true)
        setIsPollingStatus(false)

        const storeFiles = useBotSettingsFileSourcesStore.getState().files || []
        let uploadedFileUrls: string[] | undefined = undefined
        if (storeFiles.length > 0) {
          const folderName = chatBotCode ?? undefined
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

        const finalPayload: AgentRequest = {
          chatBotCode: chatBotCode ?? "",
          baseUrl: baseUrl,
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
              ? qAndAs.map(q => ({
                  qAndATitle: q.title,
                  question: q.question,
                  answer: q.answer
                }))
              : undefined,
          filePaths: [
            ...trainedPublicFileUrls.map(f => f.url),
            ...(uploadedFileUrls ?? [])
          ]
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
  }

  const handleTrainingDialogOpenChange = (open: boolean) => {
    setIsTrainingDialogOpen(open)

    if (!open) {
      setIsPollingStatus(false)
    }
  }

  return (
    <div className="mx-auto mt-7 w-full max-w-2xs">
      <Card className="p-0">
        <CardHeader className="p-3 pb-1.5">
          <CardTitle className="text-foreground text-lg font-semibold">
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="flex flex-col space-y-4">
            {isTrainedSourcesLoading ? (
              <div className="shine h-[37.6px] w-full rounded-lg" />
            ) : (
              <div className="flex flex-col space-y-2">
                {/* Website Links */}
                {websiteLinks.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconWorld className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {websiteLinks.filter(link => link.selected).length}
                        </p>

                        <p className="text-sm font-normal">Links</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>TBD</p>
                      <IconInfoCircle className="mt-0.5 size-3.5" />
                    </div>
                  </div>
                )}

                {/* Files */}
                {files.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <FileText className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {files.length}
                        </p>

                        <p className="text-sm font-normal">Files</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {files
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Text Sources */}
                {textSources.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <Type className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {textSources.length}
                        </p>

                        <p className="text-sm font-normal">Text</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {textSources
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Q&A */}
                {qAndAs.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconFilter2Question className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {qAndAs.length}
                        </p>

                        <p className="text-sm font-normal">Q&A</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {qAndAs
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {socialMedia.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconWorldHeart className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {socialMedia.length}
                        </p>

                        <p className="text-sm font-normal">Social Media</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>25</p>
                      <p>KB</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isTrainedSourcesLoading ? (
              <div className="shine h-[37.6px] w-full rounded-lg" />
            ) : (
              <div className="flex justify-between rounded-lg border border-zinc-200/90 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-slate-700 dark:bg-slate-800 dark:text-zinc-50">
                <p className="font-normal">Total size</p>
                <div className="flex items-center space-x-0.5 font-semibold">
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
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex w-full">
        <Button
          onClick={handleTrainClick}
          className="w-full"
          disabled={isButtonDisabled || isTrainedSourcesLoading}
        >
          Train agent
        </Button>
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
              src="/assets/icons/bot-settings-bot-is-learning-dialog-icon.png"
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

      {/* Agent is trained dialog */}
      <AlertDialog
        open={isTrainedDialogOpen}
        onOpenChange={setIsTrainedDialogOpen}
      >
        <AlertDialogContent className="py-5">
          {/* Add visually screen reader only title & description for accessibility. without AlertDialogTitle it shows a error */}
          <div className="sr-only">
            <AlertDialogTitle>Bot is trained dialog</AlertDialogTitle>
            <AlertDialogDescription>
              Your agent is trained on your data.
            </AlertDialogDescription>
          </div>

          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="h-16 w-16 bg-[url('/assets/icons/bot-settings-bot-is-ready-dialog-light-icon.png')] bg-contain bg-center bg-no-repeat dark:bg-[url('/assets/icons/bot-settings-bot-is-ready-dialog-dark-icon.png')]" />

            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <h3 className="text-foreground text-lg font-semibold">
                Your agent is trained on your data
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                Your agent has learned from your data and is ready to respond
                accurately.
              </p>
            </div>
          </div>

          <AlertDialogAction
            onClick={handleGoToPlayground}
            className="mx-auto mt-2 w-max"
          >
            Done
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SourcesPanel
