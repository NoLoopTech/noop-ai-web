import { IconStopwatch } from "@tabler/icons-react"
import { LeadScore } from "./schema"
import { LeadStatusEnum } from "@/models/lead"

export const leadScore = new Map<LeadScore, string>([
  ["cold", "text-chip-score-cold"],
  ["warm", "text-chip-score-warm"],
  ["hot", "text-chip-score-hot"]
])

export const leadPreference = new Map<string, string>([
  [
    "visible-preference",
    "bg-chip-preference-bg text-foreground dark:text-chip-preference-text border-chip-preference-border text-xs font-normal"
  ],
  [
    "hidden-preference",
    "bg-transparent text-foreground dark:text-chip-preference-text text-xs font-normal"
  ]
])

export const leadStatus = Object.entries(LeadStatusEnum).map(
  ([key, value]) => ({
    label: key,
    value,
    icon: IconStopwatch
  })
)
