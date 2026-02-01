"use client"

import { useProjectCode } from "@/lib/hooks/useProjectCode"
import SourcesPanel from "./SourcesPanel"
import TabContainer from "./TabContainer"
import { useBotSettingsFileSourcesStore } from "../store/botSettingsFileSources.store"
import { useApiQuery } from "@/query"
import { useEffect } from "react"
import { calculateTextSizeFromLength } from "@/utils"

interface ApiBaseUrl {
  protocol: "http://" | "https://"
  domain: string
}

interface ApiWebUrl {
  urls: string[]
}

interface ApiQaPair {
  answer: string
  question: string
  qAndATitle?: string
}

interface ApiTextTitlePair {
  textTitle: string
  text?: string
}

interface ApiSocialMedia {
  platform: string
  url: string
}

interface TrainedSourcesResponse {
  qaPairs: ApiQaPair[]
  baseUrl: ApiBaseUrl
  webUrls: ApiWebUrl
  textTitlePairs: ApiTextTitlePair[]
  socialMedia?: ApiSocialMedia[]
}

interface TrainedAzureFile {
  fileName: string
  blobName: string
  publicUrl: string
  size: number
  lastModified: string
  contentType: string
}

interface TrainedAzureFilesResponse {
  files: TrainedAzureFile[]
}

const MainContainer = () => {
  const projectId = useProjectCode()

  const {
    setTrainedBaseUrl,
    setTrainedWebsiteLinks,
    setTrainedFiles,
    setTrainedPublicFileUrls,
    setTrainedTextSources,
    setTrainedQAndAs,
    setTrainedSocialMedia,
    setBaseUrl,
    setWebsiteLinks,
    setFiles,
    setTextSources,
    setQAndAs,
    initializedProjectId,
    setInitializedProjectId
  } = useBotSettingsFileSourcesStore()

  const { data: otherTrainedSources, isLoading: isOtherTrainedSourcesLoading } =
    useApiQuery<TrainedSourcesResponse>(
      ["botsettings-trained-sources", projectId],
      `/botsettings/${projectId}/trained-sources`,
      () => ({
        method: "get"
      }),
      { enabled: !Number.isNaN(projectId) }
    )

  const { data: trainedAzureFiles, isLoading: isTrainedAzureFilesLoading } =
    useApiQuery<TrainedAzureFilesResponse>(
      ["botsettings-trained-azure-files", projectId],
      `/botsettings/${projectId}/azure-files`,
      () => ({
        method: "get"
      }),
      { enabled: !Number.isNaN(projectId) }
    )

  const isTrainedSourcesLoading =
    isOtherTrainedSourcesLoading || isTrainedAzureFilesLoading

  useEffect(() => {
    if (!otherTrainedSources) return
    if (projectId === null || projectId === "no-project") return
    if (initializedProjectId === projectId) return
    setInitializedProjectId(projectId)

    const baseUrl = {
      protocol: otherTrainedSources.baseUrl?.protocol ?? "https://",
      domain: otherTrainedSources.baseUrl?.domain ?? ""
    }

    const websiteLinks = (otherTrainedSources.webUrls?.urls ?? []).map(w => ({
      url: w,
      selected: true
    }))

    const files = (trainedAzureFiles?.files ?? []).map(f => ({
      name: f.fileName,
      size: f.size,
      status: "trained" as const
    }))

    const trainedPublicFileUrls = {
      urls: (trainedAzureFiles?.files ?? []).map(f => f.publicUrl)
    }

    const textSources = otherTrainedSources.textTitlePairs.map(t => ({
      title: t.textTitle ?? "",
      description: t.text ?? "",
      size: calculateTextSizeFromLength(t.text ?? "").bytes,
      status: "trained" as const
    }))

    const qAndAs = otherTrainedSources.qaPairs.map(q => ({
      title: q.qAndATitle ?? "",
      question: q.question ?? "",
      answer: q.answer ?? "",
      size: calculateTextSizeFromLength(q.answer ?? "").bytes,
      status: "trained" as const
    }))

    const socialMedia = (otherTrainedSources.socialMedia ?? []).map(s => ({
      platform: s.platform ?? "",
      url: s.url ?? ""
    }))

    setTrainedBaseUrl(
      websiteLinks.length > 0 ? baseUrl : { protocol: "https://", domain: "" }
    )
    setTrainedWebsiteLinks(websiteLinks)
    setTrainedFiles(files)
    setTrainedPublicFileUrls(trainedPublicFileUrls)
    setTrainedTextSources(textSources)
    setTrainedQAndAs(qAndAs)
    setTrainedSocialMedia(socialMedia)

    setBaseUrl(baseUrl)
    setWebsiteLinks(websiteLinks)
    setFiles(files)
    setTextSources(textSources)
    setQAndAs(qAndAs)
  }, [
    otherTrainedSources,
    trainedAzureFiles,
    setTrainedBaseUrl,
    setTrainedFiles,
    setTrainedQAndAs,
    setTrainedSocialMedia,
    setTrainedTextSources,
    setTrainedWebsiteLinks,
    projectId,
    initializedProjectId,
    setInitializedProjectId
  ])

  return (
    <section className="flex h-[calc(100vh-64px)] w-full">
      <div className="flex w-full flex-col border-r border-zinc-200 px-5 py-4 pr-2 dark:border-inherit">
        <div className="mx-auto my-1 w-full space-y-1.5 self-start text-left">
          <h2 className="text-2xl font-semibold">Data Sources</h2>

          <p className="text-base font-medium text-zinc-500">
            Sets the credit usage cap for this agent, based on your workspace’s
            available credits.
          </p>
        </div>

        <div className="mx-auto mt-8 mb-5 flex w-full flex-col space-y-7">
          <TabContainer isTrainedSourcesLoading={isTrainedSourcesLoading} />
        </div>
      </div>

      <div className="flex h-full w-md max-w-md bg-zinc-100 dark:bg-slate-900">
        <SourcesPanel isTrainedSourcesLoading={isTrainedSourcesLoading} />
      </div>
    </section>
  )
}

export default MainContainer
