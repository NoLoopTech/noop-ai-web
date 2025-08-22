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
import { IconBook, IconPlus } from "@tabler/icons-react"
import { Ticket } from "@/models/ticket/schema"
import { TicketsRowInfoDrawer } from "./TicketsRowInfoDrawer"
import { TicketStatus } from "@/models/ticket/enum"
import { ticketStatus } from "@/models/ticket/options"
import { useApiMutation } from "@/query/hooks/useApiMutation"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/lib/hooks/useToast"
import { useEffect } from "react"
import { useProjectCode } from "@/lib/hooks/useProjectCode"

interface Props {
  row: Row<Ticket>
  setTableLoading?: (loading: boolean) => void
}

export function TicketsTableRowActions({ row, setTableLoading }: Props) {
  const ticket = row.original

  const [open, setOpen] = useDialogState<"edit" | "detail">(null)

  const queryClient = useQueryClient()
  const projectId = useProjectCode()

  const updateStatusMutation = useApiMutation(`/tickets/updateStatus`, "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-tickets", projectId]
      })
    }
  })

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({
      ticketId: ticket.id,
      status: newStatus
    })
  }

  const { toast } = useToast()
  const deleteTicketMutation = useApiMutation(`/tickets/ticket`, "delete", {
    onSuccess: () => {
      toast({
        title: "Ticket deleted",
        description: "The ticket was deleted successfully."
      })
      queryClient.invalidateQueries({
        queryKey: ["project-tickets", projectId]
      })
    },
    onError: error => {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Failed to delete ticket. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const handleDelete = () => {
    deleteTicketMutation.mutate({
      ticketId: ticket.id,
      projectId
    })
  }

  useEffect(() => {
    if (setTableLoading) {
      setTableLoading(
        updateStatusMutation.isPending || deleteTicketMutation.isPending
      )
    }
  }, [
    updateStatusMutation.isPending,
    deleteTicketMutation.isPending,
    setTableLoading
  ])

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
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                >
                  {Object.values(TicketStatus).map(status => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      {ticketStatus[status][0]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {/* <DropdownMenuSub>
              <DropdownMenuSubTrigger>Ticket Score</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={ticket.}>
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
            </DropdownMenuSub> */}
            <DropdownMenuItem>
              Add Note
              <DropdownMenuShortcut>
                <IconPlus className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TicketsRowInfoDrawer
        key="ticket-update"
        open={open === "edit"}
        onOpenChange={() => setOpen("edit")}
        currentRow={ticket}
      />
    </>
  )
}
