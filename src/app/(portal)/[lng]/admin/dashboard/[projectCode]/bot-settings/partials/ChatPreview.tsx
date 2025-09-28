"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const ChatPreview = () => {
  const [tab, setTab] = useState("chat")

  const tabVariants = {
    initial: { opacity: 0.5, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0.5, x: -40 }
  }

  return (
    <MotionConfig
      transition={{ duration: 0.5, ease: "easeInOut", type: "tween" }}
    >
      <Tabs orientation="vertical" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="bubble">Bubble</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="sync" initial={false}>
          {tab === "chat" && (
            <motion.div
              key={tab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4"
            >
              <TabsContent value="chat" className="m-0 h-full w-full p-0">
                <div className="flex h-[580px] w-full flex-col space-y-3">
                  <div className="relative flex h-[510px] flex-col rounded-xl bg-white">
                    <div className="flex h-12 items-center justify-between rounded-t-xl bg-[#1E50EF] px-5 text-white">
                      <div className="flex items-center space-x-1.5">
                        <IconDiamond className="h-7 w-7" />
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
                        <p className="rounded-3xl bg-[#1E50EF] px-3 py-2 text-white">
                          What can you do?
                        </p>
                      </div>

                      <div className="flex max-w-72 flex-col space-y-0.5 text-[#1C1C1C]">
                        <p className="rounded-t-2xl rounded-b-xs bg-zinc-100 px-3 py-2">
                          Here’s a quick overview of what Noopy.ai can do for
                          you:
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
                          <div className="rounded-full bg-[#1E50EF] p-1">
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
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center self-end rounded-full bg-zinc-100">
                    <IconDiamond className="h-8 w-8 text-zinc-500" />
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          )}
          {tab === "bubble" && (
            <motion.div
              key={tab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4"
            >
              <TabsContent value="bubble" className="m-0 h-full w-full p-0">
                <div className="flex h-[580px] w-full flex-col space-y-3">
                  <div className="relative flex h-[510px] flex-col rounded-xl bg-white">
                    <div className="flex h-12 items-center justify-between rounded-t-xl bg-[#1E50EF] px-5 text-white">
                      <div className="flex items-center space-x-1.5">
                        <IconDiamond className="h-7 w-7" />
                        <p className="text-xl font-extrabold">NOOPY</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <IconArrowsDiagonal className="h-5 w-5" />
                        <IconX className="h-5 w-5" />
                        <IconDotsVertical className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="absolute inset-x-4 bottom-2 flex h-[90px] flex-col items-center space-y-2">
                      <div className="flex h-full items-end space-x-1 text-[10px] font-medium text-zinc-500">
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
                  <div className="flex h-14 w-14 items-center justify-center self-end rounded-full bg-zinc-100">
                    <IconDiamond className="h-8 w-8 text-zinc-500" />
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          )}
          {tab === "welcome" && (
            <motion.div
              key={tab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4"
            >
              <TabsContent value="welcome" className="m-0 h-full w-full p-0">
                <div className="flex h-[580px] w-full flex-col space-y-3">
                  <div className="relative flex h-[510px] flex-col rounded-xl bg-white">
                    <div className="flex h-12 items-center justify-between rounded-t-xl bg-[#1E50EF] px-5 text-white">
                      <div className="flex items-center space-x-1.5">
                        <IconDiamond className="h-7 w-7" />
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
                        <p className="rounded-3xl bg-[#1E50EF] px-3 py-2">
                          What can you do?
                        </p>
                      </div>

                      <div className="flex max-w-72 flex-col space-y-0.5 text-[#1C1C1C]">
                        <p className="rounded-t-2xl rounded-b-xs bg-zinc-100 px-3 py-2">
                          Here’s a quick overview of what Noopy.ai can do for
                          you:
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
                          <div className="rounded-full bg-[#1E50EF] p-1">
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
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center self-end rounded-full bg-zinc-100">
                    <IconDiamond className="h-8 w-8 text-zinc-500" />
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </MotionConfig>
  )
}

export default ChatPreview
