import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const sessionSchema = z.object({
  id: z.string(),
  country: z.string(),
  aiScore: z.string(),
  duration: z.string(),
  chatSummary: z.string(),
  dateTime: z.string()
})

export type Session = z.infer<typeof sessionSchema>

export const sessionListSchema = z.array(sessionSchema)
