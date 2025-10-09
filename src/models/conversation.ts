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
  confidenceScore: number
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
    status?: string
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

export enum ScoringOption {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NORMAL = "normal"
}

export enum SessionStatusEnum {
  IN_PROGRESS = "in-progress",
  CLOSED = "closed"
}

export const SCORE_RANGES = {
  [ScoringOption.POSITIVE]: { min: 0.6, max: 1.0 },
  [ScoringOption.NORMAL]: { min: 0.4, max: 0.6 },
  [ScoringOption.NEGATIVE]: { min: 0.0, max: 0.4 }
} as const
