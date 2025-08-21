import { z } from "zod"
import { TicketMethod, TicketPriority, TicketStatus, TicketType } from "./enum"

const ticketTypesSchema = z.enum(
  Object.values(TicketType) as [string, ...string[]]
)
export type TicketTypes = z.infer<typeof ticketTypesSchema>

const ticketStatusSchema = z.enum(
  Object.values(TicketStatus) as [string, ...string[]]
)
export type TicketStatusType = z.infer<typeof ticketStatusSchema>

const ticketPrioritySchema = z.enum(
  Object.values(TicketPriority) as [string, ...string[]]
)
export type TicketPriorityType = z.infer<typeof ticketPrioritySchema>

const ticketMethodSchema = z.enum(
  Object.values(TicketMethod) as [string, ...string[]]
)
export type TicketMethodType = z.infer<typeof ticketMethodSchema>

const _ticketSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  userName: z.string(),
  email: z.string(),
  country: z.string().optional(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  type: ticketTypesSchema,
  method: ticketMethodSchema,
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional()
})
export type Ticket = z.infer<typeof _ticketSchema>
