"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/hooks/useToast"
import { useApiMutation } from "@/query"
import { TriangleAlert } from "lucide-react"
import { useSession } from "next-auth/react"
import React, { useState } from "react"

interface DeleteAllConversationsCardProps {
  currentProject?: {
    id: number
    projectName: string
    code: string
    chatbotCode: string
    createdAt: string
  }
}

const DeleteAllConversations = ({
  currentProject
}: DeleteAllConversationsCardProps) => {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const token = session?.apiToken

  const [open, setOpen] = useState(false)

  const confirmationPhrase = `${currentProject?.projectName}/Delete all conversations`
  const [confirmationText, setConfirmationText] = useState("")

  const isMatch = confirmationText === confirmationPhrase

  const deleteAllConversations = useApiMutation(
    currentProject?.id
      ? `/dashboard/project/sessionData/${currentProject.id}`
      : "",
    "delete",
    {
      onSuccess: () => {
        toast({
          title: "Conversations deleted successfully!",
          description:
            "All conversations, Leads and Tickets have been deleted.",
          variant: "success",
          duration: 4000
        })

        setConfirmationText("")
        setOpen(false)
      },
      onError: error => {
        if (status !== "authenticated" || !token) return
        const errorMessage =
          (error as { message?: string })?.message ||
          "An error occurred while deleting conversations."
        toast({
          title: "Failed to delete conversations!",
          description: errorMessage,
          variant: "error",
          duration: 4000
        })
      }
    }
  )

  const handleDelete = () => {
    deleteAllConversations.mutate({ projectId: currentProject?.id })
  }

  return (
    <div>
      <Card className="border border-red-600">
        <CardHeader>
          <CardTitle>Delete all conversations</CardTitle>
          <CardDescription>
            Deleting all conversations is permanent. This will remove every
            conversation linked to this agent—please proceed only if you're
            sure.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full items-center justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="py-5">
                Delete Conversations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Delete All Conversations?</DialogTitle>
              </DialogHeader>
              <div className="mt-3 flex flex-col space-y-5">
                <div className="flex items-center space-x-3 rounded-sm border border-red-500 bg-red-100 px-5 py-2 dark:border-red-900/90 dark:bg-red-950/40">
                  <TriangleAlert className="h-11 w-11 stroke-red-600" />
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">
                    This will permanently delete all data linked to this agent.
                    Once deleted, it cannot be recovered.
                  </p>
                </div>

                <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-400">
                  <ul className="space-y-1 pt-1">
                    <li>Before you proceed, please note:</li>
                    <li className="ml-2 list-inside list-disc">
                      All conversations will be permanently removed.
                    </li>
                    <li className="ml-2 list-inside list-disc">
                      All conversation leads will be permanently deleted
                    </li>
                    <li className="ml-2 list-inside list-disc">
                      All associated tickets will be permanently deleted.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label
                    htmlFor="confirmationText"
                    className="text-sm font-normal"
                  >
                    To confirm, please type “
                    <span className="font-semibold select-none">
                      {confirmationPhrase}
                    </span>
                    ” in the box below
                  </Label>
                  <Input
                    id="confirmationText"
                    name="confirmationText"
                    value={confirmationText}
                    placeholder={confirmationPhrase}
                    onChange={e => setConfirmationText(e.target.value)}
                    className="border text-center text-sm placeholder:text-zinc-400 focus-visible:ring-red-500 dark:placeholder:text-zinc-600 dark:focus-visible:ring-red-900/80"
                  />
                </div>
              </div>
              <DialogFooter className="flex items-center space-x-1">
                <DialogClose asChild>
                  <Button
                    variant={`${deleteAllConversations.isPending ? "link" : "outline"}`}
                    disabled={deleteAllConversations.isPending}
                    className={`${deleteAllConversations.isPending ? "px-0" : ""}`}
                  >
                    {deleteAllConversations.isPending ? (
                      <span className="shine-text w-max text-xs">
                        Conversations & related data are being deleted
                      </span>
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={!isMatch || deleteAllConversations.isPending}
                  onClick={handleDelete}
                  className="bg-red-600 text-white transition-all duration-300 ease-in-out dark:bg-red-800"
                >
                  {deleteAllConversations.isPending
                    ? "Deleting..."
                    : "Delete All Conversations"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeleteAllConversations
