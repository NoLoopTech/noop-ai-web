import { create } from "zustand"

type BaseUrl = { protocol: "http://" | "https://"; domain: string }
type WebsiteLink = { url: string; selected: boolean }
type File = {
  name: string
  size: number
  raw?: globalThis.File
  status?: "trained" | "new"
}
type TrainedFilesToBeDeleted = { blobNames: string[] }
type TrainedPublicFileUrl = {
  urls: string[]
}
type TextSource = {
  title: string
  description: string
  size: number
  status?: "trained" | "new"
}
type QAndA = {
  title: string
  question: string
  answer: string
  size: number
  status?: "trained" | "new"
}
type SocialMedia = { platform: string; url: string }

interface BotSettingsFileSourcesState {
  // INFO: state for existing/trained bot settings data sources
  trainedBaseUrl: BaseUrl
  setTrainedBaseUrl: (baseUrl: BaseUrl) => void

  trainedWebsiteLinks: WebsiteLink[]
  setTrainedWebsiteLinks: (links: WebsiteLink[]) => void

  trainedFiles: File[]
  setTrainedFiles: (files: File[]) => void
  trainedPublicFileUrls: TrainedPublicFileUrl
  setTrainedPublicFileUrls: (urls: TrainedPublicFileUrl) => void

  trainedFilesToBeDeleted: TrainedFilesToBeDeleted
  setTrainedFilesToBeDeleted: (files: TrainedFilesToBeDeleted) => void

  trainedTextSources: TextSource[]
  setTrainedTextSources: (texts: TextSource[]) => void

  trainedQAndAs: QAndA[]
  setTrainedQAndAs: (qas: QAndA[]) => void

  trainedSocialMedia: SocialMedia[]
  setTrainedSocialMedia: (sm: SocialMedia[]) => void

  // INFO: state for new bot settings data sources
  baseUrl: BaseUrl
  setBaseUrl: (baseUrl: BaseUrl) => void

  websiteLinks: WebsiteLink[]
  setWebsiteLinks: (links: WebsiteLink[]) => void
  toggleWebsiteLink: (idx: number) => void

  files: File[]
  setFiles: (files: File[]) => void

  textSources: TextSource[]
  setTextSources: (texts: TextSource[]) => void

  qAndAs: QAndA[]
  setQAndAs: (qas: QAndA[]) => void

  socialMedia: SocialMedia[]
  setSocialMedia: (sm: SocialMedia[]) => void

  // INFO: general states
  showUrlWarning: boolean
  setShowUrlWarning: (show: boolean) => void

  chatBotCode: string | null
  setChatBotCode: (code: string | null) => void

  agentName: string | null
  setAgentName: (name: string | null) => void
}

export const useBotSettingsFileSourcesStore =
  create<BotSettingsFileSourcesState>(set => ({
    // INFO: state for existing/trained bot settings data sources
    trainedBaseUrl: { protocol: "https://", domain: "" },
    setTrainedBaseUrl: baseUrl => set({ trainedBaseUrl: baseUrl }),

    trainedWebsiteLinks: [],
    setTrainedWebsiteLinks: links => set({ trainedWebsiteLinks: links }),

    trainedFiles: [],
    setTrainedFiles: files => set({ trainedFiles: files }),
    trainedPublicFileUrls: { urls: [] },
    setTrainedPublicFileUrls: urls => set({ trainedPublicFileUrls: urls }),

    /*
     ** INFO: Temporary list of trained file identifiers (blobName) that the user has marked for deletion.
     ** Items are queued here locally and are not removed server-side until the user confirms the action by clicking the "Train Agent".
     */
    trainedFilesToBeDeleted: { blobNames: [] },
    setTrainedFilesToBeDeleted: files =>
      set({ trainedFilesToBeDeleted: files }),

    trainedTextSources: [],
    setTrainedTextSources: texts => set({ trainedTextSources: texts }),

    trainedQAndAs: [],
    setTrainedQAndAs: qas => set({ trainedQAndAs: qas }),

    trainedSocialMedia: [],
    setTrainedSocialMedia: sm => set({ trainedSocialMedia: sm }),

    // INFO: state for new bot settings data sources
    baseUrl: { protocol: "https://", domain: "" },
    setBaseUrl: baseUrl => set({ baseUrl }),

    websiteLinks: [],
    setWebsiteLinks: links => set({ websiteLinks: links }),
    toggleWebsiteLink: idx =>
      set(state => ({
        websiteLinks: state.websiteLinks.map((l, i) =>
          i === idx ? { ...l, selected: !l.selected } : l
        )
      })),

    files: [],
    setFiles: files => set({ files }),

    textSources: [],
    setTextSources: texts => set({ textSources: texts }),

    qAndAs: [],
    setQAndAs: qas => set({ qAndAs: qas }),

    socialMedia: [],
    setSocialMedia: sm => set({ socialMedia: sm }),

    showUrlWarning: false,
    setShowUrlWarning: show => set({ showUrlWarning: show }),

    chatBotCode: null,
    setChatBotCode: code => set({ chatBotCode: code }),

    agentName: null,
    setAgentName: name => set({ agentName: name })
  }))
