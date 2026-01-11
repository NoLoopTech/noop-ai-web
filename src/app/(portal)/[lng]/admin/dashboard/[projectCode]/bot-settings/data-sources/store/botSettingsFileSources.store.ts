import { create } from "zustand"

export enum BotSettingsFileSourcesSteps {
  TAB = "tab",
  PLAYGROUND = "playground",
  REGISTER = "register",
  PRICING = "pricing"
}

type WebsiteLink = { url: string; selected: boolean }
type File = { name: string; size: number; raw?: globalThis.File }
type TextSource = { title: string; description: string; size: number }
type QAndA = { title: string; question: string; answer: string; size: number }
type SocialMedia = { platform: string; url: string }

interface BotSettingsFileSourcesState {
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

  step: BotSettingsFileSourcesSteps
  setStep: (s: BotSettingsFileSourcesSteps) => void
  nextStep: () => void

  showUrlWarning: boolean
  setShowUrlWarning: (show: boolean) => void

  chatBotCode: string | null
  setChatBotCode: (code: string | null) => void

  agentPrompt: string | null
  setAgentPrompt: (prompt: string | null) => void

  agentName: string | null
  setAgentName: (name: string | null) => void
}

export const useBotSettingsFileSourcesStore =
  create<BotSettingsFileSourcesState>(set => ({
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

    step: BotSettingsFileSourcesSteps.TAB,
    setStep: s => set({ step: s }),
    nextStep: () =>
      set(state => {
        const order: BotSettingsFileSourcesSteps[] = [
          BotSettingsFileSourcesSteps.TAB,
          BotSettingsFileSourcesSteps.PLAYGROUND,
          BotSettingsFileSourcesSteps.REGISTER,
          BotSettingsFileSourcesSteps.PRICING
        ]
        const idx = order.indexOf(state.step)
        const next = order[Math.min(idx + 1, order.length - 1)]
        return { step: next }
      }),

    showUrlWarning: false,
    setShowUrlWarning: show => set({ showUrlWarning: show }),

    chatBotCode: null,
    setChatBotCode: code => set({ chatBotCode: code }),

    agentPrompt: null,
    setAgentPrompt: prompt => set({ agentPrompt: prompt }),

    agentName: null,
    setAgentName: name => set({ agentName: name })
  }))
