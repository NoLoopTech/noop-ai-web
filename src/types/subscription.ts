export enum SubscriptionTier {
  FREE = "free",
  STARTER = "starter",
  GROWTH = "growth",
  PRO = "pro",
  ENTERPRISE = "enterprise"
}

export enum Feature {
  // Core Features
  LEAD_SCORING = "lead_scoring",
  TICKET_CREATION = "ticket_creation",
  CONFIDENCE_ESCALATION = "confidence_escalation",
  EQ_AI_TONE = "eq_ai_tone",
  MULTILINGUAL_AUTO_REPLY = "multilingual_auto_reply",
  OVERVIEW_CHATS_HISTORY = "overview_chats_history",
  LEADS_PAGE = "leads_page",
  TICKETS_PAGE = "tickets_page",
  ANALYTICS_TRENDS = "analytics_trends",
  BOT_SETTINGS = "bot_settings",
  GENERAL_SETTINGS = "general_settings",
  PRIORITY_SUPPORT = "priority_support",
  SLA_DEDICATED_MANAGER = "sla_dedicated_manager"
}

export interface TierLimits {
  bots: number
  sites: number
  conversationsPerMonth: number
}

export interface TierUsage {
  bots: number
  sites: number
  conversationsThisMonth: number
}

export interface SubscriptionInfo {
  tier: SubscriptionTier
  limits: TierLimits
  usage: TierUsage
  features: Feature[]
  isUnlimited: boolean
}
