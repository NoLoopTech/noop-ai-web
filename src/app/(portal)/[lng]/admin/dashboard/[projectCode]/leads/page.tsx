import { columns } from "./partials/LeadsColumns"
import { LeadsTable } from "./partials/LeadsTable"

export default function LeadsPage() {
  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
        </div>
      </div>
      <div className="flex-1">
        <LeadsTable columns={columns} />
      </div>
    </>
  )
}
