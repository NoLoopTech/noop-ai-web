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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { TabsContent } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DarkIcon from "@/../public/assets/icons/bot-settings-icon-dark-mode.svg"
import LightIcon from "@/../public/assets/icons/bot-settings-icon-light-mode.svg"
import FullBgIcon from "@/../public/assets/icons/bot-settings-icon-welcome-full.svg"
import HalfBgIcon from "@/../public/assets/icons/bot-settings-icon-welcome-half.svg"
import { ColorPicker } from "@/components/ColorPicker"
import { IconRefresh, IconUpload } from "@tabler/icons-react"
import { FileInput } from "@/components/FileInput"
import { useEffect } from "react"

interface ChatInterfaceStylesProps {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
}

// Utility function to determine text color (black or white) based on background color
function getContrastTextColor(hex: string): string {
  // Remove hash if present
  hex = hex.replace(/^#/, "")
  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

const formSchema = z.object({
  themes: z.enum(["Dark", "Light"]).default("Dark"),
  welcomeScreenAppearance: z
    .enum(["Half Background", "Full Background"])
    .default("Full Background"),
  profilePicture: z
    .instanceof(File)
    .refine(file => file.size <= 1048576, {
      message: "File size must be less than 1MB"
    })
    .optional(),
  bubbleColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#aabbcc"),
  headerColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#aabbcc"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#aabbcc"),
  alignsChatBubbleButton: z.enum(["Left", "Right"]).default("Right"),
  textColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default(getContrastTextColor("#aabbcc"))
})
type ContentForm = z.infer<typeof formSchema>

const ChatInterfaceStyles = ({ tabVariants }: ChatInterfaceStylesProps) => {
  const form = useForm<ContentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themes: "Dark",
      welcomeScreenAppearance: "Full Background",
      profilePicture: undefined,
      bubbleColor: "#aabbcc",
      headerColor: "#aabbcc",
      color: "#aabbcc",
      alignsChatBubbleButton: "Right",
      textColor: getContrastTextColor("#aabbcc")
    }
  })

  function onSubmit(values: ContentForm) {
    // eslint-disable-next-line no-console
    console.log("Form submitted with:", values)
    // TODO: handle form submission properly and remove console log
  }

  const resetColor =
    <T extends keyof ContentForm>(
      field: ControllerRenderProps<ContentForm, T>,
      defaultColor: string
    ) =>
    () => {
      field.onChange(defaultColor as ContentForm[T])
    }

  useEffect(() => {
    const bubbleColor = form.watch("bubbleColor")
    const newTextColor = getContrastTextColor(bubbleColor)
    form.setValue("textColor", newTextColor, { shouldDirty: true })
  }, [form.watch("bubbleColor")])

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
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 p-4 pr-0 pb-0">
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
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-800 p-4 pr-0 pb-0">
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

                <Card>
                  <CardHeader className="px-5 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <CardTitle className="text-xl font-semibold">
                            Chat Bubble Appearance
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="profilePicture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile picture</FormLabel>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                              <FormDescription>
                                Supports JPG, PNG, and SVG up to 1MB
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <FileInput
                                value={field.value}
                                onChange={field.onChange}
                                accept="image/jpeg,image/png,image/svg+xml"
                                multiple={false}
                                icon={<IconUpload className="h-4 w-4" />}
                                variant="outline"
                                label="Upload"
                                display="icon-text"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bubbleColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat bubble button color</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <ColorPicker
                                  color={field.value}
                                  onChange={field.onChange}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={resetColor(field, "#1E50EF")}
                                  className="shadow-sm"
                                >
                                  <IconRefresh className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* INFO: this is a hidden input field since it is calculated automatically */}
                    <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => <input type="hidden" {...field} />}
                    />
                    {/* <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => (
                        <FormItem hidden>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat bubble text color</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <ColorPicker
                                  color={field.value}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    /> */}

                    <div
                      className="mt-3 flex h-10 w-32 items-center justify-center rounded-md shadow-sm"
                      style={{
                        backgroundColor: form.watch("bubbleColor"),
                        color: form.watch("textColor")
                      }}
                    >
                      Preview Text
                    </div>

                    <FormField
                      control={form.control}
                      name="alignsChatBubbleButton"
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel>Aligns chat bubble button</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              className="mt-1 flex h-full w-full flex-col items-start space-y-1"
                            >
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                      value="Right"
                                      id="right-align"
                                      aria-label="Right align"
                                    />
                                    <FormLabel htmlFor="right-align">
                                      Bottom Right align
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>

                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                      value="Left"
                                      id="left-align"
                                      aria-label="Left align"
                                    />
                                    <FormLabel htmlFor="left-align">
                                      Bottom Left align
                                    </FormLabel>
                                  </div>
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

                <Card>
                  <CardHeader className="px-5 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <CardTitle className="text-xl font-semibold">
                            Welcome Screen Appearance
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="welcomeScreenAppearance"
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              className="mt-1 flex h-full w-full items-center justify-start space-x-5"
                            >
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <FormLabel htmlFor="bg-half">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 px-3 pt-4 pb-0">
                                        <HalfBgIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Half Background</p>
                                        <RadioGroupItem
                                          value="Half Background"
                                          id="bg-half"
                                          aria-label="Half Background"
                                        />
                                      </CardFooter>
                                    </Card>
                                  </FormLabel>
                                </FormControl>
                              </FormItem>

                              <FormItem className="flex items-center">
                                <FormControl>
                                  <FormLabel htmlFor="bg-full">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 px-6 pt-4 pb-0">
                                        <FullBgIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Full Background</p>
                                        <RadioGroupItem
                                          value="Full Background"
                                          id="bg-full"
                                          aria-label="Full Background"
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

                    <FormField
                      control={form.control}
                      name="headerColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Screen header color</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <ColorPicker
                                  color={field.value}
                                  onChange={field.onChange}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={resetColor(field, "#1E50EF")}
                                  className="shadow-sm"
                                >
                                  <IconRefresh className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                          </div>
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
