"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
// import { Row } from "@tanstack/react-table"
import { Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import useDialogState from "@/lib/hooks/useDialogState"
// import { Session, sessionSchema } from "../data/schema"

// interface Props {
//   row: Row<Session>
// }

// export function DataTableRowActions({ row }: Props) {
// const session = sessionSchema.parse(row.original)
export function DataTableRowActions() {
  const [_open, setOpen] = useDialogState<"edit" | "detail">(null)

  return (
    <>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" onClick={() => setOpen("edit")}>
          <Edit2 />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setOpen("detail")}>
              View Detail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpen("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={session.label}>
                  {labels.map(label => (
                    <DropdownMenuRadioItem
                      key={label.value}
                      value={label.value}
                    >
                      {label.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
