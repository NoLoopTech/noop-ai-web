import { create } from "zustand"

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
}

const defaultLinks: WebsiteLink[] = [
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true }
]

export const useOnboardingStore = create<OnboardingState>(set => ({
  websiteLinks: defaultLinks,
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
  setSocialMedia: sm => set({ socialMedia: sm })
}))
