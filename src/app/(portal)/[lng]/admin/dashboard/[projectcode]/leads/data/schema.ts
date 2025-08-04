import { z } from "zod"

const leadScoreSchema = z.union([
  z.literal("cold"),
  z.literal("warm"),
  z.literal("hot")
])
export type LeadScore = z.infer<typeof leadScoreSchema>

const leadStatusSchema = z.union([
  z.literal("new"),
  z.literal("contacted"),
  z.literal("closed")
])
export type LeadStatus = z.infer<typeof leadStatusSchema>

const _leadPreferenceSchema = z.array(z.string())
export type LeadPreference = z.infer<typeof _leadPreferenceSchema>

const leadSchema = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  preference: z.array(z.string()),
  score: leadScoreSchema,
  status: leadStatusSchema,
  createdAt: z.coerce.date()
})
export type Lead = z.infer<typeof leadSchema>

export const leadListSchema = z.array(leadSchema)
