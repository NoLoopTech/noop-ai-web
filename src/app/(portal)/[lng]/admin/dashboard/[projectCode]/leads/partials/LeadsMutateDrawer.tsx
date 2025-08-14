"use client"

import { z } from "zod"
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
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import SelectDropdown from "@/components/SelectDropdown"
import { Lead } from "../data/schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { format } from "date-fns"
import { IconCircleDashed } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Lead
}

const formSchema = z.object({
  userName: z.string().min(1, "User Name is required."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(1, "Phone Number is required."),
  preference: z.array(z.string()).min(1, "Select at least one preference."),
  score: z.enum(["cold", "warm", "hot"], { required_error: "Select a score." }),
  status: z.enum(["new", "contacted", "converted", "closed"], {
    required_error: "Select a status."
  }),
  content: z.string().optional(),
  createdAt: z.string().optional()
})
type LeadForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<LeadForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          userName: currentRow.userName ?? "",
          email: currentRow.email ?? "",
          phoneNumber: currentRow.phoneNumber ?? "",
          preference: Array.isArray(currentRow.preference)
            ? currentRow.preference
            : [],
          score: currentRow.score ?? "cold",
          status: currentRow.status ?? "new",
          content: currentRow.content ?? "",
          createdAt: currentRow.createdAt
            ? new Date(currentRow.createdAt).toISOString().slice(0, 16)
            : ""
        }
      : {
          userName: "",
          email: "",
          phoneNumber: "",
          preference: [],
          score: "cold",
          status: "new",
          content: "",
          createdAt: ""
        }
  })

  // const onSubmit = (data: LeadForm) => {
  //   // do something with the form data
  //   onOpenChange(false)
  //   form.reset()
  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     )
  //   })
  // }

  const router = useRouter()
  const projectCode = useProjectCode()

  const handleViewTranscript = () => {
    if (currentRow?.threadId) {
      router.push(
        `/admin/dashboard/${projectCode}/chats/${currentRow.threadId}`
      )
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={v => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className="flex min-w-3xl flex-col">
        <SheetHeader>
          <SheetTitle>{isUpdate ? "Update" : "Create"} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? "Update the task by providing necessary info."
              : "Add a new task by providing necessary info."}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea scrollbarVariant="tiny">
          <div className="flex flex-col space-y-6 py-1 pr-3.5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-xl font-semibold">
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      See basic leads information
                    </CardDescription>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2.5">
                <Form {...form}>
                  <form
                    id="lead-form"
                    // onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 space-y-5 space-x-4"
                  >
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter user name"
                              disabled
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter email"
                              disabled
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter phone number"
                              disabled
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lead Score</FormLabel>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select score"
                            items={[
                              { label: "Hot", value: "hot" },
                              { label: "Warm", value: "warm" },
                              { label: "Cold", value: "cold" }
                            ]}
                            disabled
                            className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select status"
                            items={[
                              { label: "New", value: "new" },
                              { label: "Contacted", value: "contacted" },
                              { label: "Converted", value: "converted" },
                              { label: "Closed", value: "closed" }
                            ]}
                            disabled
                            className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="createdAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value
                                  ? format(
                                      new Date(field.value),
                                      "dd MMM, yyyy"
                                    )
                                  : ""
                              }
                              placeholder="Enter date"
                              disabled
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-2">
                  <CardTitle className="text-xl font-semibold">
                    Chat Information
                  </CardTitle>
                  <CardDescription>Manage chat information</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-1.5">
                  <h2>Captured Preferences</h2>
                  <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                    {currentRow &&
                    Array.isArray(currentRow.preference) &&
                    currentRow.preference.length > 0 ? (
                      currentRow.preference.map((pref, idx) => (
                        <div
                          key={idx}
                          className="text-foreground bg-secondary flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 capitalize"
                        >
                          <IconCircleDashed className="size-4" />
                          <p className="text-xs">{pref}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        No preferences
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <h2>Conversation Summary</h2>
                  <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                    {currentRow && currentRow.content ? (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {currentRow.content}
                      </p>
                    ) : (
                      <span className="text-muted-foreground">
                        No conversation summary available
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant={"default"}
                  onClick={handleViewTranscript}
                  className="max-w-max self-end"
                >
                  View Transcript
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
