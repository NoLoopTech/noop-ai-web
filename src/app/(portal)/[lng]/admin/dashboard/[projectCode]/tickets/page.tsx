import { columns } from "./partials/TicketsColumns"
import { TicketsTable } from "./partials/TicketsTable"

export default function TicketsPage() {
  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        </div>
      </div>
      <div className="flex-1">
        <TicketsTable columns={columns} />
      </div>
    </>
  )
}
