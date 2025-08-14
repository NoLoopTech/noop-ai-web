"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import useDialogState from "@/lib/hooks/useDialogState"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { LeadsRowInfoDrawer } from "./LeadsRowInfoDrawer"
import { Lead } from "../data/schema"
import { IconBook, IconPlus } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/query/hooks/useApiMutation"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { LeadStatusEnum } from "@/models/lead"

interface Props {
  row: Row<Lead>
}

export function LeadsTableRowActions({ row }: Props) {
  const lead = row.original
  const queryClient = useQueryClient()
  const projectId = useProjectCode()

  const updateStatusMutation = useApiMutation(`/leads/updateStatus`, "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-leads", projectId] })
    }
  })

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({
      leadId: lead.id,
      status: newStatus as LeadStatusEnum
    })
  }

  const [open, setOpen] = useDialogState<"edit" | "detail">(null)

  return (
    <>
      <div className="flex items-center gap-1">
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
            <DropdownMenuItem onClick={() => setOpen("edit")}>
              View Detail
              <DropdownMenuShortcut>
                <IconBook className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={lead.status}
                  onValueChange={handleStatusChange}
                >
                  {Object.entries(LeadStatusEnum).map(([key, value]) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Lead Score</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={lead.score}>
                  <DropdownMenuRadioItem value={"cold"}>
                    Cold
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={"warm"}>
                    Warm
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={"hot"}>
                    Hot
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              Add Note
              <DropdownMenuShortcut>
                <IconPlus className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
