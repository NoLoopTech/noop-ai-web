"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
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
import { useApiMutation } from "@/query"
import { useToast } from "@/lib/hooks/useToast"
import { useQueryClient } from "@tanstack/react-query"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { Session } from "../data/schema"
import { useEffect } from "react"

interface Props {
  row: Row<Session>
  setTableLoading?: (loading: boolean) => void
}

// export function DataTableRowActions({ row }: Props) {
// const session = sessionSchema.parse(row.original)
export function DataTableRowActions({ row, setTableLoading }: Props) {
  const [_open, setOpen] = useDialogState<"edit" | "detail">(null)
  const session = row.original
  const queryClient = useQueryClient()
  const projectId = useProjectCode()

  const { toast } = useToast()
  const deleteChatMutation = useApiMutation(`/conversations/chat`, "delete", {
    onSuccess: () => {
      toast({
        title: "Chat deleted",
        description: "The chat was deleted successfully."
      })
      queryClient.invalidateQueries({
        queryKey: ["project-chats", projectId]
      })
    },
    onError: error => {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Failed to delete chat. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  // If your mutation expects an object:
  const handleDelete = () => {
    deleteChatMutation.mutate({
      threadId: session.threadId,
      projectId: projectId
    })
  }
  useEffect(() => {
    if (setTableLoading) {
      setTableLoading(deleteChatMutation.isPending)
    }
  }, [deleteChatMutation.isPending, setTableLoading])

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
            <DropdownMenuItem onClick={handleDelete}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
