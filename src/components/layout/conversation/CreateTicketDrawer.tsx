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
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useApiMutation } from "@/query"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/lib/hooks/useToast"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { TicketPriority, TicketType } from "@/models/ticket/enum"
import { Textarea } from "@/components/ui/textarea"
import { createTicketSchema, CreateTicketInput } from "@/models/ticket/schema"
import { ScrollArea } from "@/components/ui/scroll-area"
import countryData from "@/lib/countryData.json"
import { useEffect, useState } from "react"
import { Combobox } from "@/components/ui/combo-box"
interface CreateTicketDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  threadId: string
  name?: string
  email?: string
  phone?: string
}

const ticketTypes = Object.entries(TicketType).map(([key, value]) => ({
  label: key
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  value
}))
const priorities = Object.entries(TicketPriority).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase(),
  value
}))

export default function CreateTicketDrawer({
  open,
  onOpenChange,
  threadId,
  name,
  email,
  phone
}: CreateTicketDrawerProps) {
  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      threadId,
      userName: name ?? "",
      email: email ?? "",
      priority: "",
      type: "",
      content: "",
      subject: "",
      phoneNumber: phone ?? ""
    }
  })

  const countryCodeOptions = countryData.map(country => ({
    value: `${country.dialCode}-${country.code}`,
    label: country.dialCode
  }))

  const defaultCountry = countryCodeOptions.find(opt =>
    opt.value.startsWith("+94-")
  )
  const defaultValue =
    defaultCountry?.value || countryCodeOptions[0]?.value || ""

  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultValue)

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const projectId = useProjectCode()

  const createTicketMutation = useApiMutation("/tickets/create", "post", {
    onSuccess: () => {
      toast({
        title: "Ticket Created",
        description: "Your ticket has been created successfully."
      })
      queryClient.invalidateQueries({
        queryKey: ["project-tickets", projectId]
      })
      if (threadId) {
        queryClient.invalidateQueries({ queryKey: ["chat-details", threadId] })
      }
      onOpenChange(false)
      form.reset()
    },
    onError: error => {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Failed to create ticket. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const onSubmit = (data: CreateTicketInput) => {
    const dialCode = phoneCountryCode.split("-")[0]
    const phoneCombined = `${dialCode}${data.phoneNumber}`.trim()

    createTicketMutation.mutate({
      ...data,
      phoneNumber: phoneCombined,
      threadId,
      projectId
    })
  }

  useEffect(() => {
    form.reset({
      threadId,
      userName: name ?? "",
      email: email ?? "",
      phoneNumber: phone ?? "",
      priority: "",
      type: "",
      content: "",
      subject: ""
    })
  }, [threadId, name, email, phone, open])

  return (
    <Sheet
      open={open}
      onOpenChange={v => {
        onOpenChange(v)
        if (!v) {
          form.reset()
          setPhoneCountryCode(defaultValue)
        }
      }}
    >
      <SheetContent className="flex min-w-lg flex-col">
        <SheetHeader>
          <SheetTitle>Create New Ticket</SheetTitle>
        </SheetHeader>
        <ScrollArea scrollbarVariant="tiny" className="flex-1">
          <Form {...form}>
            <form
              id="ticket-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4 px-2 py-2"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
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
                      <Input {...field} placeholder="Email" type="email" />
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
                      <div className="flex gap-2">
                        <div className="w-[120px] flex-shrink-0">
                          <Combobox
                            options={countryCodeOptions.map(opt => ({
                              value: opt.value,
                              label: opt.label
                            }))}
                            value={phoneCountryCode}
                            onChange={val => {
                              if (val) setPhoneCountryCode(val)
                            }}
                          />
                        </div>

                        <Input
                          {...field}
                          placeholder="Phone Number"
                          type="tel"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Subject of Ticket" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe in detail"
                        rows={3}
                      />
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
                    <FormLabel>Ticket Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  form="ticket-form"
                  variant="default"
                  disabled={createTicketMutation.isPending}
                >
                  {createTicketMutation.isPending
                    ? "Creating..."
                    : "Create Ticket"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
