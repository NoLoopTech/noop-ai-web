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
import { useEffect } from "react"
import CircularCrop from "@/components/CircularCrop"
import { InterfaceSettingsTypes } from "@/types/botSettings"

interface ChatInterfaceStylesProps extends InterfaceSettingsTypes {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
}

// INFO: Utility function to determine text color (black or white) based on background color
function getContrastTextColor(hex: string): string {
  // INFO: Remove hash if present
  hex = hex.replace(/^#/, "")
  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // INFO: Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  // INFO: Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

const formSchema = z.object({
  themes: z.enum(["dark", "light"]).default("dark"),
  chatButtonIcon: z
    .instanceof(File, { message: "Please select a valid image file" })
    .refine(
      file => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPG, PNG, or SVG allowed"
    )
    .optional()
    .nullable(),
  brandLogo: z
    .instanceof(File, { message: "Please select a valid image file" })
    .refine(
      file => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPG, PNG, or SVG allowed"
    )
    .optional()
    .nullable(),
  brandBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF"),
  brandTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#FFFFFF"),
  chatButtonBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#F4F4F5"),
  chatButtonTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#71717b"),
  chatButtonBorderColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#F4F4F5"),
  chatButtonPosition: z.enum(["right", "left"]).default("right"),
  welcomeScreenAppearance: z
    .enum(["half_background", "full_background"])
    .default("half_background"),
  welcomeButtonBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF"),
  welcomeButtonTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF")
})
type ContentForm = z.infer<typeof formSchema>

const ChatInterfaceStyles = ({
  tabVariants,
  setBrandStyling,
  setChatButtonStyling,
  setWelcomeScreenStyling
}: ChatInterfaceStylesProps) => {
  const form = useForm<ContentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themes: "light",
      chatButtonIcon: undefined,
      chatButtonBorderColor: "#F4F4F5",
      chatButtonBgColor: "#F4F4F5",
      chatButtonTextColor: "#71717b",
      chatButtonPosition: "right",
      brandLogo: undefined,
      brandBgColor: "#1E50EF",
      brandTextColor: "#1E50EF",
      welcomeScreenAppearance: "half_background",
      welcomeButtonBgColor: "#1E50EF",
      welcomeButtonTextColor: "#1E50EF"
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
    const welcomeButtonBgColor = form.watch("welcomeButtonBgColor")
    const newTextColor = getContrastTextColor(welcomeButtonBgColor)
    form.setValue("welcomeButtonTextColor", newTextColor, { shouldDirty: true })

    // TODO: remove this console log
    // eslint-disable-next-line no-console
    console.log("form", form.getValues())
  }, [form.watch("welcomeButtonBgColor")])

  useEffect(() => {
    const brandBgColor = form.watch("brandBgColor")
    const newTextColor = getContrastTextColor(brandBgColor)
    form.setValue("brandTextColor", newTextColor, { shouldDirty: true })
  }, [form.watch("brandBgColor")])

  useEffect(() => {
    const chatButtonBgColor = form.watch("chatButtonBgColor")
    const newTextColor = getContrastTextColor(chatButtonBgColor)
    form.setValue("chatButtonTextColor", newTextColor, { shouldDirty: true })
  }, [form.watch("chatButtonBgColor")])

  // useEffect(() => {
  //   const brandBgColor = form.watch("brandBgColor")
  //   const brandTextColor = form.watch("brandTextColor")
  //   setBrandStyling({ backgroundColor: brandBgColor, color: brandTextColor })
  // }, [form.watch("brandBgColor"), form.watch("brandTextColor")])

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  useEffect(() => {
    const brandBgColor = form.watch("brandBgColor")
    const brandTextColor = form.watch("brandTextColor")
    const brandLogoFile = form.watch("brandLogo")

    if (brandLogoFile instanceof File) {
      fileToDataUrl(brandLogoFile).then(dataUrl => {
        setBrandStyling({
          backgroundColor: brandBgColor,
          color: brandTextColor,
          brandLogo: dataUrl
        })
      })
    } else {
      setBrandStyling({
        backgroundColor: brandBgColor,
        color: brandTextColor,
        brandLogo: null
      })
    }
  }, [
    form.watch("brandBgColor"),
    form.watch("brandTextColor"),
    form.watch("brandLogo"),
    setBrandStyling
  ])

  useEffect(() => {
    const chatButtonBgColor = form.watch("chatButtonBgColor")
    const chatButtonBorderColor = form.watch("chatButtonBorderColor")
    const chatButtonIconUrl = form.watch("chatButtonIcon")
    const chatButtonPosition = form.watch("chatButtonPosition")
    const chatButtonTextColor = form.watch("chatButtonTextColor")

    if (chatButtonIconUrl instanceof File) {
      fileToDataUrl(chatButtonIconUrl).then(dataUrl => {
        setChatButtonStyling({
          backgroundColor: chatButtonBgColor,
          borderColor: chatButtonBorderColor,
          chatButtonIcon: dataUrl,
          chatButtonTextColor: chatButtonTextColor,
          chatButtonPosition: chatButtonPosition
        })
      })
    } else {
      setChatButtonStyling({
        backgroundColor: chatButtonBgColor,
        borderColor: chatButtonBorderColor,
        chatButtonIcon: null,
        chatButtonTextColor: chatButtonTextColor,
        chatButtonPosition: chatButtonPosition
      })
    }
  }, [
    form.watch("chatButtonBgColor"),
    form.watch("chatButtonBorderColor"),
    form.watch("chatButtonIcon"),
    form.watch("chatButtonPosition"),
    form.watch("chatButtonTextColor"),
    setChatButtonStyling
  ])

  useEffect(() => {
    const welcomeScreenBgColor = form.watch("welcomeScreenAppearance")
    const welcomeScreenTextColor = form.watch("welcomeButtonBgColor")
    const welcomeScreenButtonTextColor = form.watch("welcomeButtonTextColor")

    setWelcomeScreenStyling({
      welcomeScreenAppearance: welcomeScreenBgColor,
      welcomeButtonBgColor: welcomeScreenTextColor,
      welcomeButtonTextColor: welcomeScreenButtonTextColor
    })
  }, [
    form.watch("welcomeScreenAppearance"),
    form.watch("welcomeButtonBgColor"),
    form.watch("welcomeButtonTextColor"),
    setWelcomeScreenStyling
  ])

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
        <ScrollArea scrollbarVariant="tiny" className="h-[calc(100vh-265px)]">
          <div className="flex flex-col space-y-5 pt-1 pr-3.5 pb-5">
            <Form {...form}>
              <form
                id="chat-interface-style"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Card>
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Brand Styling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-5">
                    <FormField
                      control={form.control}
                      name="brandLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Logo</FormLabel>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <CircularCrop
                                value={field.value}
                                onChange={field.onChange}
                                accept="image/jpeg,image/png,image/svg+xml"
                                icon={<IconUpload className="h-4 w-4" />}
                                variant="outline"
                                label="Upload"
                                display="icon-text"
                                cropShape="logoCrop"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brandBgColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Brand color</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="brandTextColor"
                      render={({ field }) => (
                        <FormItem hidden>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Brand text color</FormLabel>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Chat Appearance
                    </CardTitle>
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
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 p-0 pt-2.5 pl-5">
                                        <LightIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Light</p>
                                        <RadioGroupItem
                                          value="light"
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
                                    <Card className="_hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary _cursor-pointer cursor-not-allowed rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-800 p-0 pt-2.5 pl-5">
                                        <DarkIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Dark</p>
                                        <RadioGroupItem
                                          value="Dark"
                                          id="dark"
                                          aria-label="Dark"
                                          disabled
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
                            Chat Button Appearance
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="chatButtonIcon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chat button icon</FormLabel>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <CircularCrop
                                value={field.value}
                                onChange={field.onChange}
                                accept="image/jpeg,image/png,image/svg+xml"
                                icon={<IconUpload className="h-4 w-4" />}
                                variant="outline"
                                label="Upload"
                                cropShape="circle"
                                display="icon-text"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chatButtonBgColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat button color</FormLabel>
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
                                  onClick={resetColor(field, "#F4F4F5")}
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
                      name="chatButtonTextColor"
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
                    />

                    <FormField
                      control={form.control}
                      name="chatButtonBorderColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat button border color</FormLabel>
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
                                  onClick={resetColor(field, "#F4F4F5")}
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

                    <FormField
                      control={form.control}
                      name="chatButtonPosition"
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel>Aligns chat button</FormLabel>
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
                                      value="right"
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
                                      value="left"
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
                  <CardContent className="space-y-5 px-5 pt-0 pb-1">
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
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 px-6 pt-4 pb-0">
                                        <HalfBgIcon />
                                      </CardContent>
                                      <CardFooter className="flex items-center justify-between border-t py-5">
                                        <p>Half Background</p>
                                        <RadioGroupItem
                                          value="half_background"
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
                                          value="full_background"
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
                      name="welcomeButtonBgColor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Submit button color</FormLabel>
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

                    {/* INFO: this is a hidden input field since it is calculated automatically */}
                    <FormField
                      control={form.control}
                      name="welcomeButtonTextColor"
                      render={({ field }) => (
                        <FormItem hidden>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>
                                Welcome screen button text color
                              </FormLabel>
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
                    />

                    {/* INFO: kept this version of text color field for testing purposes */}
                    {/* <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => <input type="hidden" {...field} />}
                      /> */}

                    {/* INFO: This is a for previewing the hidden text color calculation */}
                    {/* <div
                      className="mt-3 flex h-10 w-32 items-center justify-center rounded-md shadow-sm"
                      style={{
                        backgroundColor: form.watch("bubbleColor"),
                        color: form.watch("textColor")
                      }}
                    >
                      Preview Text
                    </div> */}
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
            form="chat-interface-style"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </TabsContent>
  )
}

export default ChatInterfaceStyles
