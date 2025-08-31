import { SCORE_RANGES, ScoringOption } from "@/models/conversation"

export default function getScoreVariant(score: number): ScoringOption {
  if (
    score >= SCORE_RANGES[ScoringOption.POSITIVE].min &&
    score <= SCORE_RANGES[ScoringOption.POSITIVE].max
  ) {
    return ScoringOption.POSITIVE
  }
  if (
    score >= SCORE_RANGES[ScoringOption.NORMAL].min &&
    score < SCORE_RANGES[ScoringOption.NORMAL].max
  ) {
    return ScoringOption.NORMAL
  }
  return ScoringOption.NEGATIVE
}
