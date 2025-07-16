export interface Lead {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  userName: string
  email: string
  phoneNumber: string
  content: string
  threadId: string
  timestamp: string
}

export interface PaginatedLeads {
  data: Lead[]
  total: number
}
