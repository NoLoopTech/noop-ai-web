"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useApiMutation, useApiQuery } from "@/query"
import { useToast } from "@/lib/hooks/useToast"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useMemo } from "react"
import { z } from "zod"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { UserProject } from "@/models/project"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface ImproveAnswerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userMessage?: string
  aiResponse?: string
}

const improveAnswerSchema = z.object({
  userQuestion: z.string(),
  improvedResponse: z.string().min(1, "Expected response cannot be empty.")
})

type ImproveAnswerInput = z.infer<typeof improveAnswerSchema>

export default function ImproveAnswerDrawer({
  open,
  onOpenChange,
  userMessage,
  aiResponse
}: ImproveAnswerDrawerProps) {
  const form = useForm<ImproveAnswerInput>({
    resolver: zodResolver(improveAnswerSchema),
    defaultValues: {
      userQuestion: "",
      improvedResponse: ""
    }
  })

  const { toast } = useToast()
  const projectId = useProjectCode()

  const { data: userProjects } = useApiQuery<UserProject[]>(
    ["user-projects"],
    `user/me/projects`,
    () => ({
      method: "get"
    })
  )

  const webName = useMemo(() => {
    if (!userProjects || !projectId) return ""
    const selectedProject = userProjects.find(p => p.id === projectId)
    return selectedProject?.chatbotCode ?? ""
  }, [userProjects, projectId])

  const improveAnswerMutation = useApiMutation<
    boolean,
    ImproveAnswerInput & { webName: string },
    ApiError
  >("/conversations/improveAnswer", "post", {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Answer has been updated successfully."
      })
      onOpenChange(false)
    },
    onError: error => {
      toast({
        title: "Error updating answer",
        description:
          error?.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    }
  })

  const onSubmit = (data: ImproveAnswerInput) => {
    if (!webName) {
      toast({
        title: "Project not found",
        description: "Could not determine the project to update.",
        variant: "destructive"
      })
      return
    }
    improveAnswerMutation.mutate({ ...data, webName })
  }

  useEffect(() => {
    if (open) {
      form.reset({
        userQuestion: userMessage ?? "",
        improvedResponse: ""
      })
    }
  }, [open, userMessage, form])

  return (
    <Sheet
      open={open}
      onOpenChange={v => {
        onOpenChange(v)
        if (!v) {
          form.reset()
        }
      }}
    >
      <SheetContent className="flex min-w-lg flex-col px-7">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Improve Answer
          </SheetTitle>
        </SheetHeader>
        <ScrollArea scrollbarVariant="tiny" className="flex-1">
          <Form {...form}>
            <form
              id="improve-answer-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-5 py-2"
            >
              <FormField
                control={form.control}
                name="userQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      User message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        readOnly
                        placeholder="User's question"
                        className="mt-1 resize-none text-sm font-normal text-zinc-500"
                        rows={6}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Noopy response
                </FormLabel>
                <FormControl>
                  <Textarea
                    readOnly
                    value={aiResponse}
                    placeholder="AI's response"
                    className="mt-1 resize-none text-sm font-normal text-zinc-500"
                    rows={6}
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="improvedResponse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Expected response
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add expected response"
                        className="mt-1 resize-none text-sm font-normal"
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-auto flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="improve-answer-form"
                  variant="default"
                  disabled={improveAnswerMutation.isPending}
                >
                  {improveAnswerMutation.isPending
                    ? "Updating..."
                    : "Update Answer"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
