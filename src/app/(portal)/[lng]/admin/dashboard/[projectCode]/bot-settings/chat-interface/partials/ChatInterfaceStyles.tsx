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
import {
  InterfaceSettingsTypes,
  StyleForm,
  StyleFormSchema
} from "@/types/botSettings"
import { useApiQuery } from "@/query"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { UserProject } from "@/models/project"
import axios from "axios"
import { Separator } from "@/components/ui/separator"
import ImageCropper from "@/components/ImageCropper"

type StyleFormInitial = Omit<StyleForm, "brandLogo" | "chatButtonIcon"> & {
  brandLogo?: File | string | null
  chatButtonIcon?: File | string | null
}

type CroppedMeta = {
  name: string
  width: number
  height: number
  size: string
}

interface ChatInterfaceStylesProps extends InterfaceSettingsTypes {
  tabVariants: {
    initial: { opacity: number; x: number }
    animate: { opacity: number; x: number }
    exit: { opacity: number; x: number }
  }
  stylingSettings?: StyleFormInitial | undefined
  brandLogoPreviewCanvasRef: React.RefObject<HTMLCanvasElement | null>
  chatButtonIconPreviewCanvasRef: React.RefObject<HTMLCanvasElement | null>
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
  brandLogoPreviewCanvasRef,
  chatButtonIconPreviewCanvasRef
}: ChatInterfaceStylesProps) => {
  const form = useForm<StyleForm>({
    resolver: zodResolver(StyleFormSchema),
    defaultValues: (stylingSettings as unknown as StyleForm) || {
      ...stylingSettings
    }
  })

  const [brandLogoCropApplied, setBrandLogoCropApplied] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>("")
  const [brandLogoCroppedImgUrl, setBrandLogoCroppedImgUrl] =
    useState<string>("")
  const [brandLogoCroppedMeta, setBrandLogoCroppedMeta] =
    useState<CroppedMeta | null>(null)
  const [brandLogoCroppingDone, setBrandLogoCroppingDone] = useState(false)

  const [chatButtonIconSrc, setChatButtonIconSrc] = useState<string>("")
  const [chatButtonCroppedImgUrl, setChatButtonCroppedImgUrl] =
    useState<string>("")
  const [chatButtonCroppedMeta, setChatButtonCroppedMeta] =
    useState<CroppedMeta | null>(null)
  const [chatButtonCroppingDone, setChatButtonCroppingDone] = useState(false)
  const [chatButtonCropApplied, setChatButtonCropApplied] = useState(false)

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

    if (brandLogoFile instanceof File && brandLogoCropApplied) {
      fileToDataUrl(brandLogoFile).then(dataUrl => {
        setBrandStyling({
          theme: theme ?? "light",
          backgroundColor: brandBgColor,
          color: brandTextColor,
          brandLogo: dataUrl
        })
        if (brandLogoCropApplied && getBrandLogoUploadUrl?.uploadUrl) {
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
    brandLogoCropApplied,
    getBrandLogoUploadUrl
  ])

  useEffect(() => {
    const chatButtonBgColor = form.watch("chatButtonBgColor")
    const chatButtonBorderColor = form.watch("chatButtonBorderColor")
    const chatButtonIconFile = form.watch("chatButtonIcon")
    const chatButtonPosition = form.watch("chatButtonPosition")
    const chatButtonTextColor = form.watch("chatButtonTextColor")

    if (chatButtonIconFile instanceof File && chatButtonCropApplied) {
      fileToDataUrl(chatButtonIconFile).then(dataUrl => {
        setChatButtonStyling({
          backgroundColor: chatButtonBgColor,
          borderColor: chatButtonBorderColor,
          chatButtonIcon: dataUrl,
          chatButtonTextColor: chatButtonTextColor,
          chatButtonPosition: chatButtonPosition
        })
        if (chatButtonCropApplied && getChatButtonIconUploadUrl?.uploadUrl) {
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
    chatButtonCropApplied,
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

  // --------------------------------------------------------------

  function handleBrandLogoInputChange(
    file: File | null,
    fileToDataUrl: (file: File) => Promise<string>,
    setImgSrc: React.Dispatch<React.SetStateAction<string>>,
    setCroppingDone: React.Dispatch<React.SetStateAction<boolean>>,
    setCroppedImgUrl: React.Dispatch<React.SetStateAction<string>>,
    setCroppedMeta: React.Dispatch<React.SetStateAction<CroppedMeta | null>>,
    fieldOnChange: (file: File) => void
  ) {
    if (file) {
      fileToDataUrl(file).then(dataUrl => {
        setImgSrc(dataUrl)
        setCroppingDone(false)
        setCroppedImgUrl("")
        setCroppedMeta(null)
        fieldOnChange(file)
      })
    }
  }

  async function handleBrandLogoCrop(
    url: string,
    setCroppedImgUrl: React.Dispatch<React.SetStateAction<string>>,
    setCroppingDone: React.Dispatch<React.SetStateAction<boolean>>,
    fieldOnChange: (file: File) => void,
    setBrandLogoCropApplied: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setCroppedImgUrl(url)
    setCroppingDone(true)
    const res = await fetch(url)
    const blob = await res.blob()
    const croppedFile = new File([blob], "brand-logo-cropped.png", {
      type: "image/png"
    })
    fieldOnChange(croppedFile)
    setBrandLogoCropApplied(true)
  }

  function handleSetBrandLogoCroppedMeta(meta: {
    name: string
    width: number
    height: number
    size: string
  }) {
    setBrandLogoCroppedMeta(meta)
  }

  function handleBrandLogoCancelCrop() {
    setImgSrc("")
  }

  // -----------------------------------

  function handleChatButtonInputChange(
    file: File | null,
    fileToDataUrl: (file: File) => Promise<string>,
    setImgSrc: React.Dispatch<React.SetStateAction<string>>,
    setCroppingDone: React.Dispatch<React.SetStateAction<boolean>>,
    setCroppedImgUrl: React.Dispatch<React.SetStateAction<string>>,
    setCroppedMeta: React.Dispatch<React.SetStateAction<CroppedMeta | null>>,
    fieldOnChange: (file: File) => void
  ) {
    if (file) {
      fileToDataUrl(file).then(dataUrl => {
        setImgSrc(dataUrl)
        setCroppingDone(false)
        setCroppedImgUrl("")
        setCroppedMeta(null)
        fieldOnChange(file)
      })
    }
  }

  async function handleChatButtonCrop(
    url: string,
    setCroppedImgUrl: React.Dispatch<React.SetStateAction<string>>,
    setCroppingDone: React.Dispatch<React.SetStateAction<boolean>>,
    fieldOnChange: (file: File) => void,
    setCropApplied: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setCroppedImgUrl(url)
    setCroppingDone(true)
    const res = await fetch(url)
    const blob = await res.blob()
    const croppedFile = new File([blob], "chat-button-icon-cropped.png", {
      type: "image/png"
    })
    fieldOnChange(croppedFile)
    setCropApplied(true)
  }

  function handleSetChatButtonCroppedMeta(meta: {
    name: string
    width: number
    height: number
    size: string
  }) {
    setChatButtonCroppedMeta(meta)
  }

  function handleCancelChatButtonCrop() {
    setChatButtonIconSrc("")
  }

  // --------------------------------------------------------------

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
              <form id="chat-interface-style" className="flex flex-col gap-4">
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
                            <div className="flex flex-col space-y-1 self-start">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <ImageCropper
                                src={imgSrc}
                                onCancel={handleBrandLogoCancelCrop}
                                previewCanvasRef={brandLogoPreviewCanvasRef}
                                setCroppedImgUrl={(url: string) =>
                                  handleBrandLogoCrop(
                                    url,
                                    setBrandLogoCroppedImgUrl,
                                    setBrandLogoCroppingDone,
                                    field.onChange,
                                    setBrandLogoCropApplied
                                  )
                                }
                                setCroppedMeta={handleSetBrandLogoCroppedMeta}
                                variant={"freeform"}
                                setCropApplied={setBrandLogoCropApplied}
                                accept="image/*"
                                icon={<IconUpload className="h-4 w-4" />}
                                onFileChange={(file: File | null) =>
                                  handleBrandLogoInputChange(
                                    file,
                                    fileToDataUrl,
                                    setImgSrc,
                                    setBrandLogoCroppingDone,
                                    setBrandLogoCroppedImgUrl,
                                    setBrandLogoCroppedMeta,
                                    field.onChange
                                  )
                                }
                                croppingDone={brandLogoCroppingDone}
                                croppedImgUrl={brandLogoCroppedImgUrl}
                                croppedMeta={brandLogoCroppedMeta}
                                setImgSrc={setImgSrc}
                                popoverTriggerText="Select Logo"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    {/* <FormField
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
                    /> */}

                    <Separator />

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

                <Card>
                  <CardHeader className="px-5 pt-5">
                    <CardTitle className="text-xl font-semibold">
                      Chat Appearance{" "}
                      <span className="text-sm font-normal opacity-30">
                        (Coming Soon)
                      </span>
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
                          <FormLabel>Chat Button Icon</FormLabel>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1 self-start">
                              <FormDescription>
                                Supports JPG, PNG, and SVG
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <ImageCropper
                                src={chatButtonIconSrc}
                                onCancel={handleCancelChatButtonCrop}
                                previewCanvasRef={
                                  chatButtonIconPreviewCanvasRef
                                }
                                setCroppedImgUrl={(url: string) =>
                                  handleChatButtonCrop(
                                    url,
                                    setChatButtonCroppedImgUrl,
                                    setChatButtonCroppingDone,
                                    field.onChange,
                                    setChatButtonCropApplied
                                  )
                                }
                                setCroppedMeta={handleSetChatButtonCroppedMeta}
                                variant={"circular"}
                                setCropApplied={setChatButtonCropApplied}
                                accept="image/*"
                                icon={<IconUpload className="h-4 w-4" />}
                                onFileChange={(file: File | null) =>
                                  handleChatButtonInputChange(
                                    file,
                                    fileToDataUrl,
                                    setChatButtonIconSrc,
                                    setChatButtonCroppingDone,
                                    setChatButtonCroppedImgUrl,
                                    setChatButtonCroppedMeta,
                                    field.onChange
                                  )
                                }
                                croppingDone={chatButtonCroppingDone}
                                croppedImgUrl={chatButtonCroppedImgUrl}
                                croppedMeta={chatButtonCroppedMeta}
                                setImgSrc={setChatButtonIconSrc}
                                popoverTriggerText="Select Icon"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    {/* <FormField
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
                    /> */}

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
      </motion.div>
    </TabsContent>
  )
}

export default ChatInterfaceStyles
