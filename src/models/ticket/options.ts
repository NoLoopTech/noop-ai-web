import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconUser
} from "@tabler/icons-react"
import { BotMessageSquare } from "lucide-react"
import { TicketMethod, TicketPriority, TicketStatus, TicketType } from "./enum"

export const ticketTypes = [
  { value: TicketType.BUG, label: "Bug" },
  { value: TicketType.FEATURE_REQUEST, label: "Feature Request" },
  { value: TicketType.INFORMATION_REQUEST, label: "Information Request" },
  { value: TicketType.CHANGE_REQUEST, label: "Change Request" },
  { value: TicketType.TECHNICAL_SUPPORT, label: "Technical Support" },
  { value: TicketType.INCIDENT_REPORT, label: "Incident Report" },
  { value: TicketType.FEEDBACK, label: "Feedback" },
  { value: TicketType.COMPLAINTS, label: "Complaints" }
]

export const ticketPriority = [
  {
    label: "High",
    value: TicketPriority.HIGH,
    icon: IconArrowUp
  },
  {
    label: "Medium",
    value: TicketPriority.MEDIUM,
    icon: IconArrowRight
  },
  {
    label: "Low",
    value: TicketPriority.LOW,
    icon: IconArrowDown
  }
]

export const ticketMethod = [
  {
    label: "Manual",
    value: TicketMethod.MANUAL,
    icon: IconUser
  },
  {
    label: "Automated",
    value: TicketMethod.AUTOMATED_USER_INQUIRY,
    icon: BotMessageSquare
  },
  {
    label: "Automated",
    value: TicketMethod.AUTOMATED_LOW_CONFIDENCE,
    icon: BotMessageSquare
  },
  {
    label: "Automated",
    value: TicketMethod.AUTOMATED_NEGATIVE_SENTIMENT,
    icon: BotMessageSquare
  }
]

export const ticketStatus: Record<TicketStatus, [string, string]> = {
  [TicketStatus.ACTIVE]: [
    "Active",
    "text-chip-active-text bg-chip-active-bg border-chip-active-border font-semibold"
  ],
  [TicketStatus.IN_PROGRESS]: [
    "In Progress",
    "text-chip-in-progress-text bg-chip-in-progress-bg border-chip-in-progress-border font-semibold"
  ],
  [TicketStatus.CLOSED]: [
    "Closed",
    "text-chip-closed-text bg-chip-closed-bg border-chip-closed-border font-semibold"
  ]
}
