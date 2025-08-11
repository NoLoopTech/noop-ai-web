import { AiScore } from "./schema"

export const aiScoreSchema = new Map<AiScore, string>([
  [
    "Positive",
    "bg-chip-positive-bg dark:text-chip-positive-text-dark border-chip-positive-border"
  ],
  [
    "Negative",
    "bg-chip-negative-bg dark:text-chip-negative-text-dark border-chip-negative-border"
  ],
  [
    "Normal",
    "bg-chip-normal-bg dark:text-chip-normal-text-dark border-chip-normal-border"
  ]
])
