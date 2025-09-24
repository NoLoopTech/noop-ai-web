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

const ticketSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  userName: z.string(),
  email: z.string(),
  country: z.string().optional(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  type: ticketTypesSchema || z.string(),
  method: ticketMethodSchema,
  content: z.string(),
  subject: z.string(),
  userDescription: z.string(),
  userAsked: z.string(),
  userResponse: z.string(),
  intent: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional()
})
export type Ticket = z.infer<typeof ticketSchema>

export const ticketListSchema = z.array(ticketSchema)

export const createTicketSchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
  userName: z.string().min(1, "Ticket name is required"),
  email: z.string().email("Invalid email address"),
  priority: z
    .preprocess(
      val => (val === "" ? undefined : val),
      ticketPrioritySchema.optional()
    )
    .refine(val => !!val, {
      message: "Choose from the dropdown"
    }),
  type: z
    .preprocess(
      val => (val === "" ? undefined : val),
      ticketTypesSchema.optional()
    )
    .refine(val => !!val, {
      message: "Choose from the dropdown"
    }),
  content: z.string().min(1, "Description is required"),
  subject: z.string().min(1, "Subject is required"),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(12, "Phone number must be at most 12 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
})
export type CreateTicketInput = z.infer<typeof createTicketSchema>
