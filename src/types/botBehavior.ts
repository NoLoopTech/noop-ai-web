export enum AgentType {
  DEFAULT = "default",
  CUSTOMER_SUPPORT_AGENT = "customer_support_agent",
  SALES_ASSISTANT = "sales_assistant",
  PRODUCT_GUIDE = "product_guide",
  FINANCE_BUDDY = "finance_buddy",
  TRAVEL_ADVISOR = "travel_advisor",
  CUSTOM_ROLE = "custom_role"
}

export enum ToneType {
  DEFAULT = "default",
  FRIENDLY = "friendly",
  FORMAL = "formal",
  PLAYFUL = "playful",
  DETAILED = "detailed",
  EMPATHETIC = "empathetic",
  NEUTRAL = "neutral"
}

export interface getBotBehaviorResponse {
  toneType: ToneType
  agentType: AgentType
  confidenceLevel: number
}
