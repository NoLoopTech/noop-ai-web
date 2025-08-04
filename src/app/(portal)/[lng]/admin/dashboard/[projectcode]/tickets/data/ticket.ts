import { faker } from "@faker-js/faker"
import { Ticket, TicketStatus } from "./schema"
import { ticketPriority } from "./data"

const generateTickets = () => {
  return Array.from({ length: 30 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const createdAt = faker.date.past()
    return {
      id: faker.string.uuid(),
      userName: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
      email: faker.internet.email({ firstName }).toLocaleLowerCase(),
      status: faker.helpers.arrayElement([
        "active",
        "in-progress",
        "closed"
      ]) as TicketStatus,
      priority: faker.helpers.arrayElement(ticketPriority.map(p => p.value)),
      type: faker.helpers.arrayElement([
        "bug",
        "feature-request",
        "information-request",
        "change-request",
        "technical-support",
        "incident-report",
        "feedback",
        "complaints"
      ]),
      createdAt
    }
  })
}

// Singleton data
let tickets: Ticket[] | null = null

export const getTickets = () => {
  if (!tickets) {
    tickets = generateTickets() // Generate data once
  }
  return tickets
}
