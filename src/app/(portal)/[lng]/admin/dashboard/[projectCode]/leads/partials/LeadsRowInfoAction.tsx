"use client"

import { Row } from "@tanstack/react-table"
import useDialogState from "@/lib/hooks/useDialogState"
import { Button } from "@/components/ui/button"
import { LeadsRowInfoDrawer } from "./LeadsRowInfoDrawer"
import { Lead } from "../data/schema"
import LongText from "@/components/LongText"

interface Props {
  row: Row<Lead>
}

export function LeadsRowInfoAction({ row }: Props) {
  const lead = row.original

  const [open, setOpen] = useDialogState<"edit" | "detail">(null)

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          onClick={() => setOpen("edit")}
          variant="link"
          className="cursor-pointer capitalize underline"
        >
          <LongText className="max-w-36">{row.original.userName}</LongText>
        </Button>
      </div>

      <LeadsRowInfoDrawer
        key="task-update"
        open={open === "edit"}
        onOpenChange={() => setOpen("edit")}
        currentRow={lead}
      />
    </>
  )
}
