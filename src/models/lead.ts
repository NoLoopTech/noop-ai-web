export enum LeadScoreType {
  Cold = "Cold Lead",
  Warm = "Warm Lead",
  Hot = "Hot Lead"
}

export enum LeadStatusEnum {
  New = "new",
  Contacted = "contacted",
  Converted = "converted",
  Closed = "closed"
}

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
  score: LeadScoreType
  tags: string
}
