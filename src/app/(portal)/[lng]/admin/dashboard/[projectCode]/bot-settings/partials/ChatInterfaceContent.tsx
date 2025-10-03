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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  IconInfoCircle,
  IconPlus,
  IconRefresh,
  IconX
} from "@tabler/icons-react"
import { useFieldArray, useForm } from "react-hook-form"
import { motion } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import RichTextEditor from "@/components/RichTextEditor"
import { useEffect } from "react"
import { ContentForm, ContentFormSchema } from "@/types/botSettings"

interface ChatInterfaceContentProps {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
  setContentPreview: (data: ContentForm) => void
}

const ChatInterfaceContent = ({
  tabVariants,
  setContentPreview
}: ChatInterfaceContentProps) => {
  const form = useForm<ContentForm>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: {
      botName: undefined,
      initialMessage: undefined,
      messagePlaceholder: undefined,
      dismissibleNotice: undefined,
      suggestedMessagesEnabled: false,
      suggestedMessages: undefined,
      collectUserFeedbackEnabled: false,
      regenerateMessagesEnabled: false,
      quickPromptsEnabled: false,
      quickPrompts: undefined,
      welcomeScreenEnabled: false,
      welcomeScreen: {
        title: undefined,
        instructions: undefined
      }
    }
  })

  const suggestedMessagesEnabled = form.watch("suggestedMessagesEnabled")
  const quickPromptsEnabled = form.watch("quickPromptsEnabled")
  const welcomeScreenEnabled = form.watch("welcomeScreenEnabled")

  const {
    fields: suggestedMessagesFields,
    append: suggestedMessagesAppend,
    remove: suggestedMessagesRemove
  } = useFieldArray<ContentForm, "suggestedMessages">({
    control: form.control,
    name: "suggestedMessages"
  })

  const {
    fields: quickPromptsFields,
    append: quickPromptsAppend,
    remove: quickPromptsRemove
  } = useFieldArray<ContentForm, "quickPrompts">({
    control: form.control,
    name: "quickPrompts"
  })

  function onSubmit(values: ContentForm) {
    if (!values.suggestedMessagesEnabled) {
      values.suggestedMessages = []
    }

    // eslint-disable-next-line no-console
    console.log("Form submitted with:", values)
    // TODO: handle form submission properly and remove console log
  }

  useEffect(() => {
    const subscription = form.watch(values => {
      setContentPreview(values as ContentForm)
    })
    return () => subscription.unsubscribe()
  }, [form, setContentPreview])

  return (
    <TabsContent key="content" value="content" className="space-y-4">
      <motion.div
        key="content"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <ScrollArea scrollbarVariant="tiny" className="h-[calc(100vh-265px)]">
          <div className="flex flex-col space-y-5 pt-1 pr-3.5 pb-5">
            <Form {...form}>
              <form
                id="chat-interface-content"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Card>
                  <CardHeader className="px-5 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <CardTitle className="text-xl font-semibold">
                            Chat Display
                          </CardTitle>
                          <CardDescription>
                            <p className="max-w-md">
                              Customize your bot&apos;s main conversation view,
                              set the display name, initial greeting, and
                              in-chat suggested messages.
                            </p>
                          </CardDescription>
                        </div>

                        <Button variant="outline" size="icon" className="p-2">
                          <IconRefresh className="h-10 w-10" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="botName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your bot name"
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="initialMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Initial messages
                            <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Hi! What can I help you with?"
                              rows={2}
                              className="mt-1 resize-none text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="messagePlaceholder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message placeholder</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Message...."
                              className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="suggestedMessagesEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between">
                            <FormLabel>Enable Suggested Messages</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {suggestedMessagesEnabled && (
                      <div className="flex flex-col space-y-2 pb-2">
                        {/* <FormLabel>Suggested Messages</FormLabel> */}
                        <p className="text-muted-foreground text-right text-xs font-medium">
                          {suggestedMessagesFields.length} of 3
                        </p>
                        {suggestedMessagesFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center space-x-2"
                          >
                            <FormField
                              control={form.control}
                              name={`suggestedMessages.${index}.text`}
                              disabled={!suggestedMessagesEnabled}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={`Suggested message ${index + 1}`}
                                      className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => suggestedMessagesRemove(index)}
                              className="p-2"
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {suggestedMessagesFields.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!suggestedMessagesEnabled}
                            onClick={() =>
                              suggestedMessagesAppend({ text: "" })
                            }
                            className="flex w-max items-center space-x-2 px-3"
                          >
                            <IconPlus className="h-4 w-4" /> Add Message
                          </Button>
                        )}
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="dismissibleNotice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Dismissible notice
                            <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                          </FormLabel>
                          <FormControl>
                            <div className="mt-1 flex flex-col space-y-1 rounded-xl bg-zinc-100 pb-2 dark:bg-zinc-700/25">
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                className="bg-background resize-none"
                              />
                              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-zinc-500">
                                <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                                <p>
                                  You can use this to add a dismissable notice.
                                  It will be dismissed after the user sends a
                                  message.
                                </p>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <MDXEditor markdown="<p>Hello World</p>" /> */}

                    <FormField
                      control={form.control}
                      name="collectUserFeedbackEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between">
                            <FormLabel>
                              Collect User Feedback
                              <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="regenerateMessagesEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between">
                            <FormLabel>
                              Regenerate Messages
                              <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-5 p-5">
                    <FormField
                      control={form.control}
                      name="quickPromptsEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between">
                            <div className="">
                              <FormLabel className="text-foreground text-lg font-semibold">
                                Quick Prompts
                              </FormLabel>
                              <FormDescription>
                                Personalize the floating chat bubble add
                                optional popup suggestions to start
                                conversations faster.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {quickPromptsEnabled && (
                      <div className="flex flex-col space-y-2">
                        {/* <FormLabel>Suggested Messages</FormLabel> */}
                        <p className="text-muted-foreground text-right text-xs font-medium">
                          {quickPromptsFields.length} of 3
                        </p>
                        {quickPromptsFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center space-x-2"
                          >
                            <FormField
                              control={form.control}
                              name={`quickPrompts.${index}.text`}
                              disabled={!quickPromptsEnabled}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      maxLength={40}
                                      {...field}
                                      placeholder={`Quick prompt ${index + 1}`}
                                      className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => quickPromptsRemove(index)}
                              className="p-2"
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {quickPromptsFields.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!quickPromptsEnabled}
                            onClick={() => quickPromptsAppend({ text: "" })}
                            className="flex w-max items-center space-x-2 px-3"
                          >
                            <IconPlus className="h-4 w-4" /> Add Message
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-5 p-5">
                    <FormField
                      control={form.control}
                      name="welcomeScreenEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between">
                            <div className="">
                              <FormLabel className="text-foreground text-lg font-semibold">
                                Welcome Screen
                              </FormLabel>
                              <FormDescription>
                                Enable this to always show a pre-chat screen
                                that collects the user’s details before they
                                start chatting.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {welcomeScreenEnabled && (
                      <div className="flex flex-col space-y-2">
                        <FormField
                          control={form.control}
                          name={`welcomeScreen.title`}
                          disabled={!welcomeScreenEnabled}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Welcome Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Almost Ready to Chat!`}
                                  className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`welcomeScreen.instructions`}
                          disabled={!welcomeScreenEnabled}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>
                                Welcome Instructions
                                <IconInfoCircle className="ml-2 inline h-4 w-4 text-zinc-400" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Tell us who you are so noopy can assist you better`}
                                  className="mt-1 text-zinc-600/95 disabled:cursor-default disabled:border-zinc-300 disabled:opacity-100 dark:text-zinc-400 disabled:dark:border-zinc-800"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </ScrollArea>
        <div className="flex w-full items-center justify-end px-3">
          <Button
            type="submit"
            variant="default"
            disabled={!form.formState.isValid}
            className="w-max disabled:opacity-50"
            form="chat-interface-content"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </TabsContent>
  )
}

export default ChatInterfaceContent
