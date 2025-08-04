import { columns } from "./partials/SessionsColumns"
import { SessionsTable } from "./partials/SessionsTable"

export default function SessionsPage() {
  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
        </div>
      </div>
      <div className="flex-1">
        <SessionsTable columns={columns} />
      </div>
    </>
  )
}
