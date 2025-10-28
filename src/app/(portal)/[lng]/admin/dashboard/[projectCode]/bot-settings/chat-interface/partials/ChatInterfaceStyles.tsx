"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { motion } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DarkIcon from "@/../public/assets/icons/bot-settings-icon-dark-mode.svg"
import LightIcon from "@/../public/assets/icons/bot-settings-icon-light-mode.svg"
import FullBgIcon from "@/../public/assets/icons/bot-settings-icon-welcome-full.svg"
import HalfBgIcon from "@/../public/assets/icons/bot-settings-icon-welcome-half.svg"
import { ColorPicker } from "@/components/ColorPicker"
import { IconRefresh, IconUpload } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"
import ImageCropper from "@/components/ImageCropper"
import {
  InterfaceSettingsTypes,
  StyleForm,
  StyleFormSchema
} from "@/types/botSettings"
import { useApiQuery } from "@/query"
import { UserProject } from "@/models/project"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import axios from "axios"

type StyleFormInitial = Omit<StyleForm, "brandLogo" | "chatButtonIcon"> & {
  brandLogo?: File | string | null
  chatButtonIcon?: File | string | null
}

interface ChatInterfaceStylesProps extends InterfaceSettingsTypes {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
  stylingSettings?: StyleFormInitial | undefined
  setCurrentEditingTab: (tab: "chat" | "chatbutton" | "welcome") => void
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

const ChatInterfaceStyles = ({
  tabVariants,
  setBrandStyling,
  setChatButtonStyling,
  setWelcomeScreenStyling,
  stylingSettings,
  setCurrentEditingTab
}: ChatInterfaceStylesProps) => {
  const form = useForm<StyleForm>({
    resolver: zodResolver(StyleFormSchema),
    defaultValues: (stylingSettings as unknown as StyleForm) || {
      ...stylingSettings
    }
  })

  const [brandLogoCropCompleted, setBrandLogoCropCompleted] = useState(false)
  const [chatButtonCropCompleted, setChatButtonCropCompleted] = useState(false)

  const currentProjectId = useProjectCode()

  const { data: userProjects } = useApiQuery<UserProject[]>(
    ["user-projects"],
    `user/me/projects`,
    () => ({
      method: "get"
    })
  )

  const memoizedProjects = useMemo(() => {
    const projects = userProjects ?? []
    return projects.map((project, index) => ({
      id: project.id,
      projectName: project.projectName ?? `Project ${index + 1}`
    }))
  }, [userProjects])

  const currentProjectName =
    memoizedProjects
      .find(p => p.id === currentProjectId)
      ?.projectName.replace(/\s/g, "-") ||
    `project-${currentProjectId || "unknown"}`

  const { data: getBrandLogoUploadUrl } = useApiQuery<{
    uploadUrl: string
    publicUrl: string
    blobName: string
    expiresOn: string
  }>(["get-brand-logo-upload-url"], "/botsettings/image/upload", () => ({
    method: "post",
    data: {
      fileName: "brand-logo-local.png",
      contentType: "image/png",
      folder: currentProjectName
    }
  }))

  const { data: getChatButtonIconUploadUrl } = useApiQuery<{
    uploadUrl: string
    publicUrl: string
    blobName: string
    expiresOn: string
  }>(["get-chat-button-icon-upload-url"], "/botsettings/image/upload", () => ({
    method: "post",
    data: {
      fileName: "chat-button-icon-local.png",
      contentType: "image/png",
      folder: currentProjectName
    }
  }))

  const resetColor =
    <T extends keyof StyleForm>(
      field: ControllerRenderProps<StyleForm, T>,
      defaultColor: string
    ) =>
    () => {
      field.onChange(defaultColor as StyleForm[T])
    }

  useEffect(() => {
    const welcomeButtonBgColor = form.watch("welcomeButtonBgColor")
    const newTextColor = getContrastTextColor(welcomeButtonBgColor)
    form.setValue("welcomeButtonTextColor", newTextColor, { shouldDirty: true })
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

  async function uploadImageToAzure(uploadUrl: string, file: File) {
    await axios.put(uploadUrl, file, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type || "application/octet-stream"
      }
    })
  }

  useEffect(() => {
    const theme = form.watch("themes")
    const brandBgColor = form.watch("brandBgColor")
    const brandTextColor = form.watch("brandTextColor")
    const brandLogoFile = form.watch("brandLogo")

    if (brandLogoFile instanceof File && brandLogoCropCompleted) {
      fileToDataUrl(brandLogoFile).then(dataUrl => {
        setBrandStyling({
          theme: theme ?? "light",
          backgroundColor: brandBgColor,
          color: brandTextColor,
          brandLogo: dataUrl
        })
        if (brandLogoCropCompleted && getBrandLogoUploadUrl?.uploadUrl) {
          uploadImageToAzure(getBrandLogoUploadUrl.uploadUrl, brandLogoFile)
            .then(() => {
              setBrandStyling({
                theme: theme ?? "light",
                backgroundColor: brandBgColor,
                color: brandTextColor,
                brandLogo: getBrandLogoUploadUrl.publicUrl
              })
            })
            .catch(err => {
              // eslint-disable-next-line no-console
              console.error("Azure upload failed:", err)
            })
        }
      })
    } else {
      setBrandStyling({
        theme: theme ?? "light",
        backgroundColor: brandBgColor,
        color: brandTextColor,
        brandLogo: null
      })
    }
  }, [
    form.watch("brandBgColor"),
    form.watch("brandTextColor"),
    form.watch("brandLogo"),
    setBrandStyling,
    brandLogoCropCompleted,
    getBrandLogoUploadUrl
  ])

  useEffect(() => {
    const chatButtonBgColor = form.watch("chatButtonBgColor")
    const chatButtonBorderColor = form.watch("chatButtonBorderColor")
    const chatButtonIconFile = form.watch("chatButtonIcon")
    const chatButtonPosition = form.watch("chatButtonPosition")
    const chatButtonTextColor = form.watch("chatButtonTextColor")

    if (chatButtonIconFile instanceof File && chatButtonCropCompleted) {
      fileToDataUrl(chatButtonIconFile).then(dataUrl => {
        setChatButtonStyling({
          backgroundColor: chatButtonBgColor,
          borderColor: chatButtonBorderColor,
          chatButtonIcon: dataUrl,
          chatButtonTextColor: chatButtonTextColor,
          chatButtonPosition: chatButtonPosition
        })
        if (chatButtonCropCompleted && getChatButtonIconUploadUrl?.uploadUrl) {
          uploadImageToAzure(
            getChatButtonIconUploadUrl.uploadUrl,
            chatButtonIconFile
          )
            .then(() => {
              setChatButtonStyling({
                backgroundColor: chatButtonBgColor,
                borderColor: chatButtonBorderColor,
                chatButtonIcon: getChatButtonIconUploadUrl.publicUrl,
                chatButtonTextColor: chatButtonTextColor,
                chatButtonPosition: chatButtonPosition
              })
            })
            .catch(err => {
              // eslint-disable-next-line no-console
              console.error("Azure upload failed:", err)
            })
        }
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
    setChatButtonStyling,
    chatButtonCropCompleted,
    getChatButtonIconUploadUrl
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

  const handleCurrentEditingTab =
    (tab: "chat" | "chatbutton" | "welcome") => () => {
      setCurrentEditingTab(tab)
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
        className="min-w-[630px] space-y-4"
      >
        <ScrollArea scrollbarVariant="tiny" className="h-[calc(100vh-265px)]">
          <div className="flex flex-col space-y-5 pt-1 pr-3.5 pb-5">
            <Form {...form}>
              <form
                id="chat-interface-style"
                className="flex flex-col gap-4 overflow-auto"
              >
                <Card className="w-full transition-all duration-300 ease-in-out hover:border-1 hover:border-slate-300 hover:bg-zinc-300/25 hover:shadow-lg dark:hover:border-slate-700/90 dark:hover:bg-slate-900/50">
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Brand Styling
                    </CardTitle>
                    <CardDescription>
                      Customize your bot’s look to match your brand. Update the
                      bot profile image and primary color for a consistent
                      visual identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-5">
                    <FormField
                      control={form.control}
                      name="brandLogo"
                      render={({ field }) => (
                        <FormItem onClick={handleCurrentEditingTab("chat")}>
                          <FormLabel>Brand Logo</FormLabel>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <ImageCropper
                                value={field.value}
                                onChange={field.onChange}
                                accept="image/jpeg,image/png,image/svg+xml"
                                icon={<IconUpload className="h-4 w-4" />}
                                variant="outline"
                                label="Upload"
                                display="icon-text"
                                cropShape="logoCrop"
                                setCropComplete={setBrandLogoCropCompleted}
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
                        <FormItem onClick={handleCurrentEditingTab("chat")}>
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
                                  type="button"
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

                    {/* INFO: This is a hidden input field since it's automatically calculated based on the brand background color */}
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
                                  type="button"
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

                <Card className="w-full transition-all duration-300 ease-in-out hover:border-1 hover:border-slate-300 hover:bg-zinc-300/25 hover:shadow-lg dark:hover:border-slate-700/90 dark:hover:bg-slate-900/50">
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Chat Appearance{" "}
                      <span className="text-sm font-normal opacity-30">
                        (Coming Soon)
                      </span>
                    </CardTitle>

                    <CardDescription>
                      Control how your chat interface looks. Switch between
                      light and dark themes to match your website’s style.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="themes"
                      render={({ field }) => (
                        <FormItem
                          className="col-span-6"
                          onClick={handleCurrentEditingTab("chat")}
                        >
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
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 p-0 pt-2 pl-3">
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

                              <FormItem
                                className="flex items-center"
                                onClick={handleCurrentEditingTab("chat")}
                              >
                                <FormControl>
                                  <FormLabel htmlFor="dark">
                                    <Card className="_hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary _cursor-pointer cursor-not-allowed rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-800 p-0 pt-2 pl-3">
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

                <Card className="w-full transition-all duration-300 ease-in-out hover:border-1 hover:border-slate-300 hover:bg-zinc-300/25 hover:shadow-lg dark:hover:border-slate-700/90 dark:hover:bg-slate-900/50">
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Chat Icon Appearance
                    </CardTitle>

                    <CardDescription>
                      Personalize the chat launcher. Upload your own icon,
                      choose background colors, and set its position on your
                      site (left or right)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 pt-0 pb-6">
                    <FormField
                      control={form.control}
                      name="chatButtonIcon"
                      render={({ field }) => (
                        <FormItem
                          onClick={handleCurrentEditingTab("chatbutton")}
                        >
                          <FormLabel>Chat icon</FormLabel>
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col space-y-1">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <ImageCropper
                                value={field.value}
                                onChange={field.onChange}
                                accept="image/jpeg,image/png,image/svg+xml"
                                icon={<IconUpload className="h-4 w-4" />}
                                variant="outline"
                                label="Upload"
                                cropShape="circle"
                                display="icon-text"
                                setCropComplete={setChatButtonCropCompleted}
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
                        <FormItem
                          onClick={handleCurrentEditingTab("chatbutton")}
                        >
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat icon button color</FormLabel>
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
                                  type="button"
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

                    {/* INFO: This is a hidden input field since it's automatically calculated based on the chat button background color */}
                    <FormField
                      control={form.control}
                      name="chatButtonTextColor"
                      render={({ field }) => (
                        <FormItem hidden>
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat icon text color</FormLabel>
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
                        <FormItem
                          onClick={handleCurrentEditingTab("chatbutton")}
                        >
                          <div className="flex items-center justify-between space-y-0">
                            <div className="flex flex-col space-y-1">
                              <FormLabel>Chat icon border color</FormLabel>
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
                                  type="button"
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
                          <FormLabel>Aligns chat icon</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              className="mt-3 flex h-full w-full flex-col items-start space-y-1"
                            >
                              <FormItem
                                onClick={handleCurrentEditingTab("chatbutton")}
                              >
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

                              <FormItem
                                onClick={handleCurrentEditingTab("chatbutton")}
                              >
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

                <Card className="w-full transition-all duration-300 ease-in-out hover:border-1 hover:border-slate-300 hover:bg-zinc-300/25 hover:shadow-lg dark:hover:border-slate-700/90 dark:hover:bg-slate-900/50">
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
                              <FormItem
                                className="flex items-center"
                                onClick={handleCurrentEditingTab("welcome")}
                              >
                                <FormControl>
                                  <FormLabel htmlFor="bg-half">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 px-3 pt-0 pb-0 dark:bg-slate-900">
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

                              <FormItem
                                className="flex items-center"
                                onClick={handleCurrentEditingTab("welcome")}
                              >
                                <FormControl>
                                  <FormLabel htmlFor="bg-full">
                                    <Card className="hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer rounded-xl duration-300 ease-in-out transform-fill">
                                      <CardContent className="m-0 rounded-t-[12px] bg-zinc-50 px-3 pt-0 pb-0 dark:bg-slate-900">
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
                        <FormItem onClick={handleCurrentEditingTab("welcome")}>
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
                                  type="button"
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

                    {/* INFO: This is a hidden input field since it's automatically calculated based on the chat welcome screen background color */}
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
      </motion.div>
    </TabsContent>
  )
}

export default ChatInterfaceStyles
