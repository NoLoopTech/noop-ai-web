import { columns } from "./partials/TicketsColumns"
import { ticketListSchema } from "./data/schema"
import { getTickets } from "./data/ticket"
import { TicketsTable } from "./partials/TicketsTable"

export default function TicketsPage() {
  const tickets = getTickets()
  const ticketList = ticketListSchema.parse(tickets)

  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        </div>
      </div>
      <div className="flex-1">
        <TicketsTable data={ticketList} columns={columns} />
      </div>
    </>
  )
}
