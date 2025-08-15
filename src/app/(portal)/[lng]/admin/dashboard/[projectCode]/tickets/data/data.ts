import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconUser
} from "@tabler/icons-react"
import { TicketStatus } from "./schema"
import { BotMessageSquare } from "lucide-react"

export const ticketTypes = [
  { value: "bug", label: "Bug" },
  { value: "feature-request", label: "Feature Request" },
  { value: "information-request", label: "Information Request" },
  { value: "change-request", label: "Change Request" },
  { value: "technical-support", label: "Technical Support" },
  { value: "incident-report", label: "Incident Report" },
  { value: "feedback", label: "Feedback" },
  { value: "complaints", label: "Complaints" }
]

export const ticketPriority = [
  {
    label: "High",
    value: "high",
    icon: IconArrowUp
  },
  {
    label: "Medium",
    value: "medium",
    icon: IconArrowRight
  },
  {
    label: "Low",
    value: "low",
    icon: IconArrowDown
  }
]

export const ticketMethod = [
  {
    label: "Manual",
    value: "manual",
    icon: IconUser
  },
  {
    label: "Automated",
    value: "automated-user-inquiry",
    icon: BotMessageSquare
  },
  {
    label: "Automated",
    value: "automated-low-confidence-response",
    icon: BotMessageSquare
  },
  {
    label: "Automated",
    value: "automated-negative-sentiment-detected",
    icon: BotMessageSquare
  }
]

export const ticketStatus = new Map<TicketStatus, [string, string]>([
  [
    "active",
    [
      "Active",
      "text-chip-active-text bg-chip-active-bg border-chip-active-border font-semibold"
    ]
  ],
  [
    "in-progress",
    [
      "In Progress",
      "text-chip-in-progress-text bg-chip-in-progress-bg border-chip-in-progress-border font-semibold"
    ]
  ],
  [
    "closed",
    [
      "Closed",
      "text-chip-closed-text bg-chip-closed-bg border-chip-closed-border font-semibold"
    ]
  ]
])
