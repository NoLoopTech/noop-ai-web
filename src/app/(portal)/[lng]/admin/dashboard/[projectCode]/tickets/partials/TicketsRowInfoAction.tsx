"use client"

import { Row } from "@tanstack/react-table"
import useDialogState from "@/lib/hooks/useDialogState"
import { Button } from "@/components/ui/button"
import LongText from "@/components/LongText"
import { Ticket } from "../data/schema"
import { TicketsMutateDrawer } from "./TicketsMutateDrawer"

interface Props {
  row: Row<Ticket>
}

export function TicketsRowInfoAction({ row }: Props) {
  const ticket = row.original

  const [open, setOpen] = useDialogState<"edit" | "detail">(null)

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          onClick={() => setOpen("edit")}
          variant="link"
          className="cursor-pointer capitalize underline"
        >
          <LongText className="max-w-36">{row.original.id}</LongText>
        </Button>
      </div>

      <TicketsMutateDrawer
        key="ticket-update"
        open={open === "edit"}
        onOpenChange={() => setOpen("edit")}
        currentRow={ticket}
      />
    </>
  )
}
