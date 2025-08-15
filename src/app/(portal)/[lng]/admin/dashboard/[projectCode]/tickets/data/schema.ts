import { z } from "zod"
import { ticketPriority } from "./data"

const ticketTypesSchema = z.union([
  z.literal("bug"),
  z.literal("feature-request"),
  z.literal("information-request"),
  z.literal("change-request"),
  z.literal("technical-support"),
  z.literal("incident-report"),
  z.literal("feedback"),
  z.literal("complaints")
])
export type TicketTypes = z.infer<typeof ticketTypesSchema>

const ticketStatusSchema = z.union([
  z.literal("active"),
  z.literal("in-progress"),
  z.literal("closed")
])
export type TicketStatus = z.infer<typeof ticketStatusSchema>

const _ticketPrioritySchema = z.enum(
  ticketPriority.map(p => p.value) as [string, ...string[]]
)
export type TicketPriority = z.infer<typeof _ticketPrioritySchema>

const methodSchema = z.union([
  z.literal("manual"),
  z.literal("automated-user-inquiry"),
  z.literal("automated-low-confidence-response"),
  z.literal("automated-negative-sentiment-detected")
])
export type TicketMethod = z.infer<typeof methodSchema>

const ticketSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  userName: z.string(),
  email: z.string(),
  country: z.string().optional(),
  status: ticketStatusSchema,
  priority: z.string().optional(),
  type: ticketTypesSchema,
  method: methodSchema,
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional()
})
export type Ticket = z.infer<typeof ticketSchema>

export const ticketListSchema = z.array(ticketSchema)
