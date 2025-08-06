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

const ticketSchema = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  status: ticketStatusSchema,
  priority: z.string().optional(),
  type: ticketTypesSchema,
  createdAt: z.coerce.date()
})
export type Ticket = z.infer<typeof ticketSchema>

export const ticketListSchema = z.array(ticketSchema)
