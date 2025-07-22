export interface ChatMessage {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  content: string
  sender: "user" | "ai"
  threadId: string
  projectId: number
  timestamp: string
  userName?: string
  email?: string
  country?: string
}

export interface ChatSessionResponse {
  session: {
    id: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    score: string
    summary: string
    threadId: string
    projectId: number
    timestamp: string
    country: string
  }
  duration: number
}
