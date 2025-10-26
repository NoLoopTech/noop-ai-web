"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatStylePreviewType, ContentForm } from "@/types/botSettings"
import {
  IconArrowsDiagonal,
  IconArrowUp,
  IconCopy,
  IconDiamond,
  IconDotsVertical,
  IconPalette,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
  IconX
} from "@tabler/icons-react"
import { Smile } from "lucide-react"
import { motion, AnimatePresence, MotionConfig } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ChatPreviewProps extends ChatStylePreviewType {
  contentPreview: ContentForm | undefined
  isBotSettingsLoading: boolean
  brandLogoPreviewCanvasRef: React.RefObject<HTMLCanvasElement | null>
  chatButtonIconPreviewCanvasRef: React.RefObject<HTMLCanvasElement | null>
  isChatIconCropping?: boolean
  isBrandLogoCropping?: boolean
}

const ChatPreview = ({
  brandStyling,
  chatButtonStyling,
  welcomeScreenStyling,
  contentPreview,
  isBotSettingsLoading,
  brandLogoPreviewCanvasRef,
  chatButtonIconPreviewCanvasRef,
  isChatIconCropping,
  isBrandLogoCropping
}: ChatPreviewProps) => {
  const [tab, setTab] = useState("chat")
  const [brandLogoVersion, setBrandLogoVersion] = useState(Date.now())
  const [chatButtonIconVersion, setChatButtonIconVersion] = useState(Date.now())
  const [toggleDismissibleNotice, setToggleDismissibleNotice] = useState(false)

  useEffect(() => {
    setToggleDismissibleNotice(contentPreview?.dismissibleNotice ? true : false)
  }, [contentPreview?.dismissibleNotice])

  const tabVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      width: "100%",
      y: 0,
      opacity: 1
    },
    exit: { y: 20, opacity: 0 }
  }

  const brandColor = {
    backgroundColor: brandStyling.backgroundColor ?? "#1E50EF",
    color: brandStyling.color ?? "#FFFFFF"
  }

  const buttonStyle = {
    backgroundColor: chatButtonStyling.backgroundColor ?? "#F4F4F5",
    border: `1px solid ${chatButtonStyling.borderColor ?? "#F4F4F5"}`,
    alignSelf:
      chatButtonStyling.chatButtonPosition === "left"
        ? "flex-start"
        : "flex-end"
  }

  const welcomeScreenButtonStyling = {
    backgroundColor: welcomeScreenStyling.welcomeButtonBgColor ?? "#1E50EF",
    color: welcomeScreenStyling.welcomeButtonTextColor ?? "#FFFFFF"
  }

  const welcomeScreenAppearance = welcomeScreenStyling.welcomeScreenAppearance
  const chatButtonIcon = chatButtonStyling.chatButtonIcon

  const buttonPosition = {
    left: chatButtonStyling.chatButtonPosition === "right" ? "100%" : 0,
    right: chatButtonStyling.chatButtonPosition === "left" ? "100%" : 0
  }

  useEffect(() => {
    const canvas = brandLogoPreviewCanvasRef.current
    const logoSrc = brandStyling.brandLogo
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 128
    const height = 32
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)

    if (!logoSrc) return

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, width, height)
      const scale = Math.min(width / img.width, height / img.height)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const offsetX = 0 // Align left
      const offsetY = (height - drawHeight) / 2
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }
    img.onerror = () => ctx.clearRect(0, 0, width, height)
    img.src = logoSrc as string
  }, [brandStyling.brandLogo, brandLogoPreviewCanvasRef])

  useEffect(() => {
    const canvas = chatButtonIconPreviewCanvasRef.current
    const iconSrc = chatButtonStyling.chatButtonIcon
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 56
    canvas.width = size
    canvas.height = size
    ctx.clearRect(0, 0, size, size)

    if (!iconSrc) return

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, size, size)
      const scale = Math.min(size / img.width, size / img.height)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const offsetX = (size - drawWidth) / 2
      const offsetY = (size - drawHeight) / 2
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }
    img.onerror = () => ctx.clearRect(0, 0, size, size)
    img.src = iconSrc as string
  }, [chatButtonStyling.chatButtonIcon, chatButtonIconPreviewCanvasRef])

  return (
    <MotionConfig
      transition={{ duration: 0.5, ease: "easeInOut", type: "tween" }}
    >
      <Tabs orientation="vertical" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger disabled={isBotSettingsLoading} value="chatbutton">
            Chat Button
          </TabsTrigger>
          <TabsTrigger disabled={isBotSettingsLoading} value="welcome">
            Welcome
          </TabsTrigger>
        </TabsList>

        {tab === "chat" && (
          <TabsContent value="chat" className="m-0 mt-3 h-full w-full p-0">
            <div className="flex h-[580px] w-full flex-col space-y-3">
              <AnimatePresence mode="sync">
                <motion.div
                  key={tab}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`flex h-[510px] min-w-[350px] ${isBotSettingsLoading ? "min-h-[560px]" : ""} flex-col rounded-xl bg-white`}
                >
                  {isBotSettingsLoading ? (
                    <div className="flex h-[300px] items-center justify-center text-gray-500">
                      <IconPalette className="h-24 w-24 animate-pulse stroke-[0.5] duration-[1500ms]" />
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex h-12 items-center justify-between rounded-t-xl px-5"
                        style={brandColor}
                      >
                        {/* <div className="relative flex items-center overflow-clip text-[6px]">
                          <canvas
                            ref={brandLogoPreviewCanvasRef}
                            className={`h-8 w-32 object-contain object-left`}
                          />
                        </div> */}
                        <div className="relative flex items-center overflow-clip rounded-sm text-[6px]">
                          {isBotSettingsLoading ? (
                            <div
                              style={buttonStyle}
                              className={`shine flex h-8 w-32 object-contain object-left`}
                            />
                          ) : (
                            <div className="relative flex items-center justify-center">
                              <canvas
                                ref={brandLogoPreviewCanvasRef}
                                className={`h-8 w-32 object-contain object-left`}
                              />
                              {!brandStyling.brandLogo &&
                                !isBrandLogoCropping && (
                                  <p
                                    className="text-3xl font-semibold uppercase"
                                    style={{ color: brandColor.color }}
                                  >
                                    {contentPreview?.botName}
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <IconArrowsDiagonal className="h-5 w-5" />
                          <IconX className="h-5 w-5" />
                          <IconDotsVertical className="h-5 w-5" />
                        </div>
                      </div>
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex flex-col space-y-2">
                        <div
                          className="flex h-12 items-center justify-between rounded-t-xl px-5"
                          style={brandColor}
                        >
                          <div className="flex items-center space-x-1.5 text-[6px]">
                            {brandLogo ? (
                              <Image
                                src={
                                  brandLogo
                                    ? `${brandLogo}?v=${brandLogoVersion}`
                                    : ""
                                }
                                alt={"Brand Logo"}
                                width={30}
                                height={26}
                              />
                            ) : (
                              <IconDiamond
                                className="h-7 w-7"
                                style={{ color: brandColor.color }}
                              />
                            )}
                            <p className="text-xl font-extrabold uppercase">
                              {contentPreview?.botName?.trim() || "Noopy"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <IconArrowsDiagonal className="h-5 w-5" />
                            <IconX className="h-5 w-5" />
                            <IconDotsVertical className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-3 px-4 py-3 text-xs">
                          <div className="flex max-w-72 flex-col space-y-0.5 text-[#1C1C1C]">
                            <p className="rounded-t-2xl rounded-b-xs bg-zinc-100 px-3 py-2">
                              Hi John! 👋
                            </p>
                            <p className="w-full rounded-t-xs rounded-b-2xl bg-zinc-100 px-3 py-2 wrap-anywhere">
                              {contentPreview?.initialMessage?.trim() ||
                                "How can I help you today?"}
                            </p>
                          </div>

                          <div className="self-end">
                            <p
                              className="rounded-3xl px-3 py-2"
                              style={brandColor}
                            >
                              What can you do?
                            </p>
                          </div>

                          <div className="flex max-w-72 flex-col space-y-0.5 text-[#1C1C1C]">
                            <p className="rounded-t-2xl rounded-b-xs bg-zinc-100 px-3 py-2">
                              Here’s a quick overview of what{" "}
                              {(contentPreview?.botName ?? "Noopy.ai") ||
                                "Noopy.ai"}{" "}
                              can do for you:
                            </p>
                            <div className="flex flex-col space-y-1.5">
                              <div className="rounded-t-xs rounded-b-2xl bg-zinc-100 px-3 py-2">
                                <ul className="list-inside list-disc space-y-1 text-xs font-semibold">
                                  <li>Automate Customer Support</li>
                                  <li>Improve Efficiency</li>
                                  <li>Personalized Interactions</li>
                                </ul>
                              </div>

                              <div className="flex items-center justify-between px-3">
                                <div className="flex items-center text-[10px] text-zinc-400">
                                  <p className="border-r border-zinc-200 pr-1.5 capitalize">
                                    {contentPreview?.botName?.trim() || "Noopy"}
                                  </p>
                                  <p className="pl-1.5">Just Now</p>
                                </div>
                                <div className="flex items-center space-x-1.5 text-zinc-600">
                                  <IconCopy className="h-3.5 w-3.5" />

                                  {contentPreview?.collectUserFeedbackEnabled && (
                                    <>
                                      <IconThumbUp className="h-3.5 w-3.5" />
                                      <IconThumbDown className="h-3.5 w-3.5" />
                                    </>
                                  )}

                                  {contentPreview?.regenerateMessagesEnabled && (
                                    <IconRefresh className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-max flex-col items-center px-4">
                        <div
                          className={`h-full w-full transition-all duration-300 ease-in-out ${toggleDismissibleNotice ? "rounded-t-xl rounded-b-3xl bg-zinc-200/80" : ""}`}
                        >
                          {/* Dismissible Notice */}
                          {toggleDismissibleNotice && (
                            <div className="flex items-center justify-between space-x-2 px-3.5 py-1.5">
                              <p className="text-tiny w-full font-normal wrap-anywhere text-zinc-500">
                                {contentPreview?.dismissibleNotice?.trim()}
                              </p>

                              <IconX className="h-3.5 w-3.5 text-zinc-500" />
                            </div>
                          )}

                          <div className="flex h-20 w-full flex-col justify-between rounded-3xl border-2 border-zinc-200 bg-white px-3 pt-2.5 pb-1.5">
                            <p className="w-full text-xs wrap-anywhere text-zinc-900">
                              {contentPreview?.messagePlaceholder?.trim() ||
                                `How do I register to ${contentPreview?.botName?.trim() || "Noopy"}?`}
                            </p>
                            <div className="flex items-center justify-between">
                              <Smile className="h-3.5 w-3.5 text-zinc-500" />
                              <div
                                className="rounded-full p-1"
                                style={brandColor}
                              >
                                <IconArrowUp className="h-3.5 w-3.5 text-zinc-50" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 py-2 text-[10px] font-medium text-zinc-500">
                          <p>Powered by </p>
                          <Image
                            src="/assets/noopy-blue-full.png"
                            alt="Noopy.ai Logo"
                            width={60}
                            height={10}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {isBotSettingsLoading ? (
                <div
                  style={buttonStyle}
                  className={`shine flex h-14 w-14 flex-shrink-0 rounded-full`}
                />
              ) : (
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={buttonStyle}
                  animate={buttonPosition}
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-clip rounded-full text-[6px]">
                    <canvas
                      ref={chatButtonIconPreviewCanvasRef}
                      className={`h-14 w-14 rounded-full object-contain object-center`}
                    />
                    {!chatButtonStyling.chatButtonIcon &&
                      !isChatIconCropping && (
                        <IconDiamond
                          className="absolute h-8 w-8"
                          style={{
                            color: chatButtonStyling.chatButtonTextColor
                          }}
                        />
                      )}
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>
        )}

        {tab === "chatbutton" && (
          <TabsContent
            value="chatbutton"
            className="m-0 mt-3 h-full w-full min-w-[350px] p-0"
          >
            <div className="flex h-[580px] w-full flex-col justify-end space-y-3">
              <AnimatePresence mode="sync">
                <motion.div
                  key={tab}
                  variants={{
                    initial: { y: 20, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: 20, opacity: 0 }
                  }}
                  transition={{
                    ease: "easeInOut",
                    type: "tween"
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative flex flex-col space-y-3 rounded-xl"
                >
                  {contentPreview?.quickPromptsEnabled &&
                    contentPreview.quickPrompts.map((prompt, index) => (
                      <motion.div
                        key={
                          chatButtonStyling.chatButtonPosition +
                          `-prompt-${index}`
                        }
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          alignSelf:
                            chatButtonStyling.chatButtonPosition === "left"
                              ? "flex-start"
                              : "flex-end"
                        }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{
                          y: { delay: 0.3, ease: "easeInOut", type: "tween" },
                          opacity: {
                            delay: 0.3,
                            ease: "easeInOut",
                            type: "tween"
                          },
                          alignSelf: {
                            delay: 1,
                            duration: 0.5,
                            ease: "easeInOut"
                          }
                        }}
                        className="w-max rounded-lg bg-white px-3 py-2 text-zinc-800 shadow-lg"
                        style={{
                          alignSelf:
                            chatButtonStyling.chatButtonPosition === "left"
                              ? "flex-start"
                              : "flex-end"
                        }}
                      >
                        <p
                          className={`${
                            chatButtonStyling.chatButtonPosition === "right"
                              ? "text-right"
                              : "text-left"
                          } text-sm font-normal`}
                        >
                          {prompt.text || `Quick Prompt ${index + 1}`}
                        </p>
                      </motion.div>
                    ))}
                </motion.div>

                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={buttonStyle}
                  animate={buttonPosition}
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* {chatButtonStyling.chatButtonIcon ? (
                    <Image
                      src={chatButtonIcon as string}
                      alt="Brand Logo"
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  ) : (
                    <IconDiamond
                      className="h-8 w-8"
                      style={{ color: chatButtonStyling.chatButtonTextColor }}
                    />
                  )} */}
                </motion.div>
              </AnimatePresence>
            </div>
          </TabsContent>
        )}

        {tab === "welcome" && (
          <TabsContent value="welcome" className="m-0 mt-3 h-full w-full p-0">
            <div className="flex h-[580px] w-full min-w-[350px] flex-col space-y-3">
              <AnimatePresence mode="sync">
                <motion.div
                  key={tab}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative flex h-[510px] flex-col rounded-xl bg-white"
                >
                  <div
                    className="flex flex-col rounded-t-xl px-4 pb-5"
                    style={brandColor}
                  >
                    <div className="flex items-center space-x-1.5 py-5">
                      <IconDiamond className="h-7 w-7" />
                      <p className="text-2xl font-extrabold uppercase">
                        {contentPreview?.botName?.trim() || "Noopy"}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-0.5 capitalize">
                      <h2 className="w-full text-2xl font-bold wrap-anywhere">
                        {contentPreview?.welcomeScreen.title?.trim() ||
                          "Almost Ready to Chat!"}
                      </h2>
                      <p className="max-w-11/12 text-sm font-normal wrap-anywhere capitalize">
                        {contentPreview?.welcomeScreen.instructions?.trim() ||
                          "Tell us who you are so Noopy can assist you better."}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex h-full flex-col justify-between rounded-b-xl px-4 py-4"
                    style={
                      welcomeScreenAppearance === "full_background"
                        ? brandColor
                        : { backgroundColor: "#FFF", color: "#18181b" }
                    }
                  >
                    <div className="flex flex-col space-y-4">
                      <p className="mb-1 text-xs font-medium">Username</p>
                      <div className="rounded-md border border-zinc-300 bg-white p-3">
                        <p className="text-xs font-normal text-zinc-500">
                          John Doe
                        </p>
                      </div>

                      <p className="mb-1 text-xs font-medium">Email</p>
                      <div className="rounded-md border border-zinc-300 bg-white p-3">
                        <p className="text-xs font-normal text-zinc-500">
                          john@example.com
                        </p>
                      </div>

                      <div
                        className={`rounded-sm p-3 ${
                          welcomeScreenButtonStyling.backgroundColor ===
                            "#1E50EF" &&
                          welcomeScreenAppearance === "full_background"
                            ? `border ${brandColor.color === "#FFFFFF" ? "border-zinc-300" : "border-zinc-600"}`
                            : ""
                        }`}
                        style={
                          welcomeScreenButtonStyling.backgroundColor ===
                          "#1E50EF"
                            ? brandColor
                            : welcomeScreenButtonStyling
                        }
                      >
                        <p className="text-center text-xs font-normal">
                          Start New Chat
                        </p>
                      </div>
                    </div>

                    <p
                      className="text-left text-[9.5px] font-normal"
                      style={
                        welcomeScreenAppearance === "full_background"
                          ? brandColor
                          : { color: "#71717b" }
                      }
                    >
                      By chatting with us, you agree to the monitoring and
                      recording of this chat to deliver our services and
                      processing of your personal data in accordance with our
                      Privacy Policy. See our{" "}
                      <span className="font-medium underline">
                        Privacy Policy
                      </span>
                      .
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={buttonStyle}
                animate={buttonPosition}
                layout
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {chatButtonStyling.chatButtonIcon ? (
                  <Image
                    src={chatButtonIcon as string}
                    alt="Brand Logo"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                ) : (
                  <IconDiamond
                    className="h-8 w-8"
                    style={{ color: chatButtonStyling.chatButtonTextColor }}
                  />
                )}
              </motion.div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </MotionConfig>
  )
}

export default ChatPreview
