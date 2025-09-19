"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { TabsContent } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { MarkdownEditor } from "@/components/RichTextEditor"
import DarkIcon from "@/../public/assets/icons/bot-settings-icon-dark-mode.svg"
import LightIcon from "@/../public/assets/icons/bot-settings-icon-light-mode.svg"

interface ChatInterfaceStylesProps {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
}

const formSchema = z.object({
  // botName: z.string().min(1, "Bot Name is required."),
  // initialMessage: z.string().min(1, "Initial message is required."),
  // messagePlaceholder: z.string().min(1, "Message placeholder is required."),
  // // richtext: z.string().min(1, "Initial messages are required."),
  // suggestedMessagesEnabled: z.boolean().default(false),
  // suggestedMessages: z.array(
  //   z.object({
  //     text: z.string()
  //   })
  // ),
  // collectUserFeedbackEnabled: z.boolean().default(false),
  // regenerateMessagesEnabled: z.boolean().default(false),
  // quickPromptsEnabled: z.boolean().default(false),
  // quickPrompts: z.array(
  //   z.object({
  //     text: z.string()
  //   })
  // ),
  themes: z.enum(["Dark", "Light"]).default("Dark")
})
type ContentForm = z.infer<typeof formSchema>

const ChatInterfaceStyles = ({ tabVariants }: ChatInterfaceStylesProps) => {
  const form = useForm<ContentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themes: "Dark"
    }
  })

  // const suggestedMessagesEnabled = form.watch("suggestedMessagesEnabled")
  // const quickPromptsEnabled = form.watch("quickPromptsEnabled")
  // const welcomeScreenEnabled = form.watch("welcomeScreenEnabled")

  // const {
  //   fields: suggestedMessagesFields,
  //   append: suggestedMessagesAppend,
  //   remove: suggestedMessagesRemove
  // } = useFieldArray<ContentForm, "suggestedMessages">({
  //   control: form.control,
  //   name: "suggestedMessages"
  // })

  // const {
  //   fields: quickPromptsFields,
  //   append: quickPromptsAppend,
  //   remove: quickPromptsRemove
  // } = useFieldArray<ContentForm, "quickPrompts">({
  //   control: form.control,
  //   name: "quickPrompts"
  // })

  function onSubmit(values: ContentForm) {
    // if (!values.suggestedMessagesEnabled) {
    //   values.suggestedMessages = []
    // }

    // eslint-disable-next-line no-console
    console.log("Form submitted with:", values)
    // TODO: handle form submission properly and remove console log
  }

  return (
    <TabsContent key="style" value="style">
      <motion.div
        key="style"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <ScrollArea scrollbarVariant="tiny" className="h-[calc(100vh-215px)]">
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
                            Chat Appearance
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="themes"
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel>Themes</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              className="mt-1 flex h-full w-full items-center justify-start space-x-5"
                            >
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <FormLabel htmlFor="light">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-xl bg-zinc-50 p-2 pr-0 pb-0">
                                        <LightIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Light</p>
                                        <RadioGroupItem
                                          value="Light"
                                          id="light"
                                          aria-label="Light"
                                        />
                                      </CardFooter>
                                    </Card>
                                  </FormLabel>
                                </FormControl>
                              </FormItem>

                              <FormItem className="flex items-center">
                                <FormControl>
                                  <FormLabel htmlFor="dark">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-xl bg-zinc-800 p-2 pr-0 pb-0">
                                        <DarkIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Dark</p>
                                        <RadioGroupItem
                                          value="Dark"
                                          id="dark"
                                          aria-label="Dark"
                                        />
                                      </CardFooter>
                                    </Card>
                                  </FormLabel>
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>
            <Button
              type="submit"
              variant="default"
              disabled={!form.formState.isValid}
              className="w-max self-end disabled:opacity-50"
              form="chat-interface-content"
            >
              Save
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    </TabsContent>
  )
}

export default ChatInterfaceStyles
