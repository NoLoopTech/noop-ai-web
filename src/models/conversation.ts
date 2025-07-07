export interface Project {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  code: string
  userId: number
  botType: string
  chatbotCode: string
}

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
  project: Project
  userName?: string
  email?: string
  country?: string
}

export interface ChatConversation {
  id: string
  country: string
  userName: string
  email: string
  scoring: string
  duration: string
  summary: string
  messages: ChatMessage[]
}

export type GroupedConversations = Record<string, ChatMessage[]>

export interface PaginatedChats {
  data: ChatMessage[]
  total: number
}
