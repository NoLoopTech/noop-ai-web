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
import { useApiQuery, useFastApiMutation } from "@/query"
import { useToast } from "@/lib/hooks/useToast"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useMemo } from "react"
import { z } from "zod"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { UserProject } from "@/models/project"

interface ImproveAnswerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userMessage?: string
  aiResponse?: string
}

const improveAnswerSchema = z.object({
  user_question: z.string(),
  improved_response: z.string().min(1, "Expected response cannot be empty.")
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
      user_question: "",
      improved_response: ""
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
    return selectedProject?.code ?? ""
  }, [userProjects, projectId])

  const improveAnswerMutation = useFastApiMutation(
    `${process.env.NEXT_PUBLIC_FAST_API_URL}chat/improve/${webName}`,
    "post",
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Submission successful!"
        })
        onOpenChange(false)
        form.reset()
      },
      onError: error => {
        const errorMessage =
          (error as { message?: string })?.message ||
          "Failed to submit. Please try again."
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    }
  )

  //   const onSubmit = (data: ImproveAnswerInput) => {
  //     improveAnswerMutation.mutate(data)
  //   }

  const onSubmit = (data: ImproveAnswerInput) => {
    if (!webName) {
      toast({
        title: "Error",
        description:
          "Project information is not available yet. Please try again shortly.",
        variant: "destructive"
      })
      return
    }
    improveAnswerMutation.mutate(data)
  }

  useEffect(() => {
    if (open) {
      form.reset({
        user_question: userMessage ?? "",
        improved_response: ""
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
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  User message
                </FormLabel>
                <FormControl>
                  <Textarea
                    readOnly
                    value={userMessage}
                    placeholder="User's question"
                    className="mt-1 resize-none text-sm font-normal text-zinc-500"
                    rows={6}
                  />
                </FormControl>
              </FormItem>

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
                name="improved_response"
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
