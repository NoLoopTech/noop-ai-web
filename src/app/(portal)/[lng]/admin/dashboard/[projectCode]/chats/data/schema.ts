import { z } from "zod"

const aiScoreSchema = z.union([
  z.literal("positive"),
  z.literal("negative"),
  z.literal("normal")
])
export type AiScore = z.infer<typeof aiScoreSchema>

export const sessionSchema = z.object({
  id: z.string(),
  country: z.string(),
  userName: z.string(),
  email: z.string(),
  aiScore: aiScoreSchema,
  duration: z.string(),
  chatSummary: z.string(),
  dateTime: z.string(),
  intent: z.string(),
  threadId: z.string()
})

export type Session = z.infer<typeof sessionSchema>

export const sessionListSchema = z.array(sessionSchema)
