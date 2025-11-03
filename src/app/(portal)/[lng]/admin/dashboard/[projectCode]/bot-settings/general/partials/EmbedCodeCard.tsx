"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from "react-markdown"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  IconBook2,
  IconChevronDown,
  IconCopy,
  IconDownload
} from "@tabler/icons-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import WordpressLogo from "@/../public/assets/icons/wordpress-logo.svg"
import Link from "next/link"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { StoreIcon } from "lucide-react"

interface EmbedCodeCardProps {
  currentProject?: {
    id: number
    projectName: string
    code: string
    chatbotCode: string
    createdAt: string
  }
  isUserProjectsLoading: boolean
}

const EmbedCodeCard = ({
  currentProject,
  isUserProjectsLoading
}: EmbedCodeCardProps) => {
  const [tab, setTab] = useState("html")
  const [integrationCodeCopied, setIntegrationCodeCopied] = useState(false)

  const integrationCode = `\`\`\`html
<script id="noopy-api-key">
  window.NoopyApiKey = "${currentProject?.code}";
</script>
<script src="${process.env.NEXT_PUBLIC_BOX_URL}/noopy-loader.js"></script>
\`\`\``

  const copyIntegrationCode = async () => {
    const code = integrationCode
      .replace(/^```[^\n]*\n/, "")
      .replace(/\n```$/, "")
    try {
      await navigator.clipboard.writeText(code)
      setIntegrationCodeCopied(true)
      setTimeout(() => setIntegrationCodeCopied(false), 2000)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Copy failed", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Use the embed code below to place this chatbot directly on your
          website—no extra setup required.
        </CardDescription>
        <CardContent className="mt-5 w-full space-y-4 p-0">
          <div className="flex w-full flex-col space-y-1.5">
            <p className="text-sm font-medium">Code</p>

            <Card className="p-3">
              <CardContent className="w-full space-y-4 p-0">
                <div className="flex w-full flex-col space-y-1.5">
                  <Tabs
                    orientation="vertical"
                    value={tab}
                    onValueChange={setTab}
                  >
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-1.5 dark:border-slate-800">
                      <TabsList>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                      </TabsList>

                      <IconCopy
                        onClick={copyIntegrationCode}
                        className={`mr-1 h-5 w-5 cursor-pointer transition-colors duration-500 ease-in-out ${integrationCodeCopied ? "stroke-emerald-600 dark:stroke-emerald-600" : "stroke-zinc-400 hover:stroke-zinc-500 dark:stroke-zinc-500 dark:hover:stroke-zinc-700"}`}
                      />
                    </div>

                    {tab === "html" && (
                      <TabsContent value="html">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key="html"
                            layout
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                            className="px-1.5 py-3 text-sm/6 font-normal"
                            style={{ overflow: "hidden" }}
                          >
                            {isUserProjectsLoading ? (
                              <div className="mt-0.5 flex w-full flex-col space-y-2.5">
                                <div className="shine h-4 max-w-full rounded-sm" />
                                <div className="shine h-4 max-w-full rounded-sm" />
                                <div className="shine h-4 max-w-full rounded-sm" />
                                <div className="shine h-4 max-w-full rounded-sm" />
                              </div>
                            ) : (
                              <Markdown
                                components={{
                                  pre: ({ node, ...props }) => (
                                    <pre
                                      className="overflow-x-auto text-zinc-500"
                                      {...props}
                                    />
                                  )
                                }}
                              >
                                {integrationCode}
                              </Markdown>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </TabsContent>
                    )}

                    {tab === "wordpress" && (
                      <TabsContent value="wordpress">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key="wordpress"
                            layout
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="flex flex-col space-y-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm/6 font-normal dark:border-slate-800">
                              <div className="w-max rounded-lg bg-[#3858e9] p-2.5">
                                <WordpressLogo className="h-8 w-8" />
                              </div>

                              <div className="">
                                <h2 className="text-foreground text-lg font-semibold">
                                  WordPress
                                </h2>
                                <p className="text-sm font-medium text-zinc-500">
                                  Use the official Noopy plugin for WordPress to
                                  effortlessly integrate the Noopy chat widget
                                  across your entire website no coding required.
                                  Simply enter your API key, enable integration,
                                  and start engaging visitors with smart
                                  AI-powered conversations.
                                </p>
                              </div>

                              <div className="mt-2 flex w-full items-center justify-end space-x-2">
                                <Link
                                  href="#"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-600 hover:bg-zinc-100"
                                >
                                  <IconBook2 className="h-4 w-4" />
                                </Link>

                                <ButtonGroup>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        aria-label="More Options"
                                      >
                                        <span className="flex">
                                          Wordpress Plugin
                                        </span>
                                        <IconChevronDown />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300! hover:text-zinc-700!">
                                          <a
                                            href="https://noopy.ai/wordpress-plugin/noopy-integration-plugin.zip"
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none" }}
                                            className="mx-auto flex items-center gap-x-1.5 rounded-sm bg-transparent hover:bg-transparent"
                                          >
                                            <IconDownload className="h-4 w-4" />
                                            Download Plugin (.zip)
                                          </a>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem className="bg-[#3858e9] text-white hover:bg-[#3858e9]/90! hover:text-white!">
                                          <a
                                            href="#"
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none" }}
                                            className="mx-auto flex items-center gap-x-1.5 rounded-sm bg-transparent hover:bg-transparent"
                                          >
                                            <StoreIcon className="h-4 w-4" />
                                            Install via WordPress store
                                          </a>
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </ButtonGroup>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default EmbedCodeCard
