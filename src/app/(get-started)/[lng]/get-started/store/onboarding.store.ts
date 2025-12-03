import { create } from "zustand"

export enum OnboardingSteps {
  TAB = "tab",
  PLAYGROUND = "playground",
  REGISTER = "register",
  PRICING = "pricing"
}

type WebsiteLink = { url: string; selected: boolean }
type File = { name: string; size: number }
type TextSource = { content: string }
type QAndA = { question: string; answer: string }
type SocialMedia = { platform: string; url: string }

interface OnboardingState {
  websiteLinks: WebsiteLink[]
  setWebsiteLinks: (links: WebsiteLink[]) => void
  toggleWebsiteLink: (idx: number) => void

  files: File[]
  setFiles: (files: File[]) => void

  textSources: TextSource[]
  setTextSources: (texts: TextSource[]) => void

  qandas: QAndA[]
  setQAndAs: (qas: QAndA[]) => void

  socialMedia: SocialMedia[]
  setSocialMedia: (sm: SocialMedia[]) => void

  step: OnboardingSteps
  setStep: (s: OnboardingSteps) => void
  nextStep: () => void

  showUrlWarning: boolean
  setShowUrlWarning: (show: boolean) => void
}

export const useOnboardingStore = create<OnboardingState>(set => ({
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

  qandas: [],
  setQAndAs: qas => set({ qandas: qas }),

  socialMedia: [],
  setSocialMedia: sm => set({ socialMedia: sm }),

  step: OnboardingSteps.TAB,
  setStep: s => set({ step: s }),
  nextStep: () =>
    set(state => {
      const order: OnboardingSteps[] = [
        OnboardingSteps.TAB,
        OnboardingSteps.PLAYGROUND,
        OnboardingSteps.REGISTER,
        OnboardingSteps.PRICING
      ]
      const idx = order.indexOf(state.step)
      const next = order[Math.min(idx + 1, order.length - 1)]
      return { step: next }
    }),

  showUrlWarning: false,
  setShowUrlWarning: show => set({ showUrlWarning: show })
}))
