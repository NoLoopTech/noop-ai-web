"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatStylePreviewType } from "@/types/botSettings"
import {
  IconArrowsDiagonal,
  IconArrowUp,
  IconCopy,
  IconDiamond,
  IconDotsVertical,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
  IconX
} from "@tabler/icons-react"
import { Smile } from "lucide-react"
import { motion, AnimatePresence, MotionConfig } from "motion/react"
import Image from "next/image"
import { useState } from "react"

const ChatPreview = ({
  brandStyling,
  chatButtonStyling,
  welcomeScreenStyling
}: ChatStylePreviewType) => {
  const [tab, setTab] = useState("chat")

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
  const brandLogo = brandStyling.brandLogo

  const buttonPosition = {
    left: chatButtonStyling.chatButtonPosition === "right" ? "100%" : 0,
    right: chatButtonStyling.chatButtonPosition === "left" ? "100%" : 0
  }

  return (
    <MotionConfig
      transition={{ duration: 0.5, ease: "easeInOut", type: "tween" }}
    >
      <Tabs orientation="vertical" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="chatbutton">Chat Button</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
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
                  className="relative flex h-[510px] flex-col rounded-xl bg-white"
                >
                  <div
                    className="flex h-12 items-center justify-between rounded-t-xl px-5"
                    style={brandColor}
                  >
                    <div className="flex items-center space-x-1.5">
                      {brandLogo ? (
                        <Image
                          src={brandLogo}
                          alt="Brand Logo"
                          width={30}
                          height={26}
                        />
                      ) : (
                        <IconDiamond
                          className="h-7 w-7"
                          style={{ color: brandColor.color }}
                        />
                      )}
                      <p className="text-xl font-extrabold">NOOPY</p>
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
                      <p className="rounded-t-xs rounded-b-2xl bg-zinc-100 px-3 py-2">
                        How can I help you today?
                      </p>
                    </div>

                    <div className="self-end">
                      <p className="rounded-3xl px-3 py-2" style={brandColor}>
                        What can you do?
                      </p>
                    </div>

                    <div className="flex max-w-72 flex-col space-y-0.5 text-[#1C1C1C]">
                      <p className="rounded-t-2xl rounded-b-xs bg-zinc-100 px-3 py-2">
                        Here’s a quick overview of what Noopy.ai can do for you:
                      </p>
                      <div className="flex flex-col space-y-1.5">
                        <div className="rounded-t-xs rounded-b-2xl bg-zinc-100 px-3 py-2">
                          <ul className="list-inside list-disc space-y-1 text-xs font-semibold">
                            <li>Automate Customer Support</li>
                            <li>Improve Efficiency</li>
                            <li>Personalized Interactions</li>
                            <li>Easy Setup</li>
                            <li>Scalable Solution</li>
                            <li>Real-Time Analytics</li>
                          </ul>
                        </div>

                        <div className="flex items-center justify-between px-3">
                          <div className="flex items-center text-[10px] text-zinc-400">
                            <p className="border-r border-zinc-200 pr-1.5">
                              Noopy
                            </p>
                            <p className="pl-1.5">Just Now</p>
                          </div>
                          <div className="flex items-center space-x-1.5 text-zinc-600">
                            <IconCopy className="h-3.5 w-3.5" />
                            <IconThumbUp className="h-3.5 w-3.5" />
                            <IconThumbDown className="h-3.5 w-3.5" />
                            <IconRefresh className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-4 bottom-2 flex h-[90px] flex-col items-center space-y-2">
                    <div className="flex h-full w-full flex-col justify-between rounded-3xl border-2 border-zinc-200 bg-white px-3 pt-2.5 pb-1.5">
                      <p className="text-xs text-zinc-900">
                        How do I register to noopy?
                      </p>
                      <div className="flex items-center justify-between">
                        <Smile className="h-3.5 w-3.5 text-zinc-500" />
                        <div className="rounded-full p-1" style={brandColor}>
                          <IconArrowUp className="h-3.5 w-3.5 text-zinc-50" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] font-medium text-zinc-500">
                      <p>Powered by </p>
                      <Image
                        src="/assets/noopy-blue-full.png"
                        alt="Noopy.ai Logo"
                        width={60}
                        height={10}
                      />
                    </div>
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

        {tab === "chatbutton" && (
          <TabsContent
            value="chatbutton"
            className="m-0 mt-3 h-full w-full p-0"
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
                  {/* First bubble */}
                  <motion.div
                    key={chatButtonStyling.chatButtonPosition + "-bubble1"}
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
                      opacity: { delay: 0.3, ease: "easeInOut", type: "tween" },
                      alignSelf: {
                        delay: 1,
                        duration: 0.5,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-4/6 rounded-lg bg-white px-3 py-2 text-zinc-800 shadow-lg"
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
                      coming soon
                    </p>
                  </motion.div>

                  {/* Second bubble */}
                  <motion.div
                    key={chatButtonStyling.chatButtonPosition + "-bubble2"}
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
                      y: { delay: 0.1, ease: "easeInOut", type: "tween" },
                      opacity: { delay: 0.1, ease: "easeInOut", type: "tween" },
                      alignSelf: {
                        delay: 0.8,
                        duration: 0.5,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-11/12 rounded-lg bg-white px-3 py-2 text-zinc-800 shadow-lg"
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
                      coming soon
                    </p>
                  </motion.div>
                </motion.div>

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
              </AnimatePresence>
            </div>
          </TabsContent>
        )}

        {tab === "welcome" && (
          <TabsContent value="welcome" className="m-0 mt-3 h-full w-full p-0">
            <div className="flex h-[580px] w-full flex-col space-y-3">
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
                      <p className="text-2xl font-extrabold">NOOPY</p>
                    </div>

                    <div className="flex flex-col space-y-0.5">
                      <h2 className="text-2xl font-bold">
                        Almost Ready to Chat!
                      </h2>
                      <p className="max-w-11/12 text-sm font-normal">
                        Tell us who you are so Noopy can assist you better.
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
