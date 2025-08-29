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
    userName: string
    email: string
    score: number
    summary: string
    threadId: string
    projectId: number
    timestamp: string
    country: string
    intent: string
  }
  duration: number
  scoreCategory: string
}

export interface ChatDetailsResponse {
  activeTicketCount: number
  topicTrend: string | null
  scorePercent: number | null
  userName: string | null
  email: string | null
  phoneNumber: string | null
  potentialLeadScore: number | null
  segments: number | null
}
