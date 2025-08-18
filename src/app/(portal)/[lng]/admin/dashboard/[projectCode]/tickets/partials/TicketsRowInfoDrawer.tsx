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
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconPencilMinus,
  IconRectangleFilled,
  IconStopwatch
} from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useRouter } from "next/navigation"
import { Ticket } from "@/models/ticket/schema"
import {
  ticketMethod,
  ticketPriority,
  ticketStatus,
  ticketTypes
} from "@/models/ticket/options"
import { TicketReasonVariants } from "./TicketReasonVariants"
import {
  TicketMethod,
  TicketPriority,
  TicketStatus,
  TicketType
} from "@/models/ticket/enum"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Ticket
}

const formSchema = z.object({
  userName: z.string().min(1, "User Name is required."),
  email: z.string().email("Invalid email address."),
  country: z.string().optional(),
  content: z.string().min(1, "Content is required."),
  status: z.enum(Object.values(TicketStatus) as [string, ...string[]]),
  priority: z
    .enum(Object.values(TicketPriority) as [string, ...string[]])
    .optional(),
  type: z.enum(Object.values(TicketType) as [string, ...string[]]),
  method: z
    .enum(Object.values(TicketMethod) as [string, ...string[]])
    .optional(),
  createdAt: z.string().optional()
})
type TicketForm = z.infer<typeof formSchema>

export function TicketsRowInfoDrawer({
  open,
  onOpenChange,
  currentRow
}: Props) {
  const form = useForm<TicketForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          userName: currentRow.userName ?? "",
          email: currentRow.email ?? "",
          country: currentRow.country ?? "N/A",
          status: currentRow.status ?? "active",
          priority: currentRow.priority ?? "",
          type: currentRow.type ?? "bug",
          content: currentRow.content ?? "",
          method: currentRow.method ?? "manual",
          createdAt: currentRow.createdAt
            ? new Date(currentRow.createdAt).toISOString().slice(0, 16)
            : ""
        }
      : {
          userName: "",
          email: "",
          status: "active",
          priority: "",
          method: "manual",
          type: "bug",
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
        `/admin/dashboard/${projectCode}/leads/${currentRow.threadId}`
      )
    }
  }

  // Status
  const statusObj =
    currentRow?.status &&
    ticketStatus[currentRow.status as keyof typeof ticketStatus]
      ? ticketStatus[currentRow.status as keyof typeof ticketStatus]
      : null
  const statusLabel = statusObj
    ? statusObj[0]
    : (currentRow?.status ?? "Active")
  const statusClass = statusObj ? statusObj[1] : "text-muted-foreground italic"

  // Priority
  const priorityObj = currentRow?.priority
    ? ticketPriority.find(p => p.value === currentRow.priority)
    : null
  const priorityLabel = priorityObj
    ? priorityObj.label
    : (currentRow?.priority ?? "medium")
  const PriorityIcon = priorityObj?.icon
  const priorityClass = "text-chip-default-gray capitalize"

  // Method
  const methodObj = currentRow?.method
    ? ticketMethod.find(m => m.value === currentRow.method)
    : null
  const methodLabel = methodObj
    ? methodObj.label
    : (currentRow?.method ?? "automated")
  const MethodIcon = methodObj?.icon
  const methodClass =
    "text-chip-default-gray bg-chip-ticket-type-bg border-chip-ticket-type-border rounded-md border px-3 py-1 text-xs font-semibold capitalize"

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
          <SheetTitle>
            <div className="flex flex-col justify-start space-y-2">
              <div className="flex items-center space-x-2.5">
                <h3 className="text-card-foreground text-xl font-semibold">
                  Ticket #{currentRow?.id}
                </h3>
                <p className="text-muted-foreground text-sm font-normal">
                  {currentRow?.createdAt &&
                    new Date(currentRow.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <div
                  className={`flex w-max items-center gap-x-1 rounded-md border px-2 py-0.5 text-sm capitalize ${statusClass}`}
                >
                  <IconStopwatch size={16} />
                  <span>{statusLabel}</span>
                </div>

                <div
                  className={`flex w-max items-center gap-x-1 rounded-md border px-2 py-0.5 text-sm capitalize ${priorityClass}`}
                >
                  {PriorityIcon && <PriorityIcon size={16} />}
                  <span>{priorityLabel}</span>
                </div>

                <div
                  className={`flex w-max items-center gap-x-1 capitalize ${methodClass} !text-sm`}
                >
                  {MethodIcon && <MethodIcon size={16} />}
                  <span>{methodLabel}</span>
                </div>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea scrollbarVariant="tiny">
          <div className="flex flex-col space-y-6 py-1 pr-3.5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-xl font-semibold">
                      Ticket Information
                    </CardTitle>
                  </div>
                  <Button variant="outline">
                    <IconPencilMinus size={16} />
                    Edit
                  </Button>
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <div className="mt-1 flex cursor-default items-center rounded-md border border-zinc-300 px-2 dark:border-zinc-800">
                              <div className="flex items-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-400">
                                {currentRow?.country ? (
                                  <>
                                    {/* <CountryFlag
                countryCode={countryNameToCode(currentRow.country)}
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              /> */}
                                    <IconRectangleFilled size={20} />
                                  </>
                                ) : (
                                  <>
                                    <IconRectangleFilled size={20} />
                                  </>
                                )}
                              </div>
                              <Input
                                {...field}
                                value={currentRow?.country || "N/A"}
                                placeholder="Enter country"
                                disabled
                                className="border-none pl-1.5 disabled:cursor-default"
                              />
                            </div>
                          </FormControl>
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
                          <FormControl>
                            <div className="mt-1 flex cursor-default items-center rounded-md border border-zinc-300 px-2 opacity-100 dark:border-zinc-800">
                              <div className="flex items-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-400">
                                <IconStopwatch size={18} />
                              </div>
                              <Input
                                {...field}
                                value={
                                  ticketPriority.find(
                                    p => p.value === currentRow?.priority
                                  )?.label || "Medium"
                                }
                                placeholder="Enter status"
                                disabled
                                className="border-none pl-1.5 disabled:cursor-default"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <div className="mt-1 flex cursor-default items-center rounded-md border border-zinc-300 px-2 opacity-100 dark:border-zinc-800">
                              <div className="flex items-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-400">
                                {PriorityIcon && <PriorityIcon size={16} />}
                              </div>
                              <Input
                                {...field}
                                value={
                                  ticketPriority.find(
                                    p => p.value === currentRow?.priority
                                  )?.label || "Medium"
                                }
                                placeholder="Enter priority"
                                disabled
                                className="border-none pl-1.5 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                ticketTypes.find(
                                  t => t.value === currentRow?.type
                                )?.label || "Bug"
                              }
                              placeholder="Enter type"
                              disabled
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
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
                              { label: "Active", value: "active" },
                              { label: "In Progress", value: "in-progress" },
                              { label: "Closed", value: "closed" }
                            ]}
                            disabled
                            className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {currentRow && (
              <TicketReasonVariants
                ticket={currentRow}
                onViewTranscript={handleViewTranscript}
              />
            )}
          </div>
        </ScrollArea>

        <SheetFooter>
          <Button variant={"outline"}>Cancel</Button>
          <Button variant={"default"}>Reply via Email</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
