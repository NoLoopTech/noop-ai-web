export interface Ticket {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  userName: string
  email: string
  phoneNumber: string
  status: string
  priority: string
  type: string
  content: string
  threadId: string
  timestamp: string
}
