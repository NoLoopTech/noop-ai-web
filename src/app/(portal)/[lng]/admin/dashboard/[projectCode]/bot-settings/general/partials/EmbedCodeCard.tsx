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
import { IconCopy } from "@tabler/icons-react"

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
                    <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-1.5 dark:border-slate-800">
                      <TabsList>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                      </TabsList>

                      <IconCopy
                        onClick={copyIntegrationCode}
                        className={`mr-1 h-5 w-5 cursor-pointer transition-colors duration-500 ease-in-out ${integrationCodeCopied ? "stroke-emerald-600 dark:stroke-emerald-600" : "stroke-zinc-400 hover:stroke-zinc-500 dark:stroke-zinc-500 dark:hover:stroke-zinc-700"}`}
                      />
                    </div>
                    {tab === "html" && (
                      <TabsContent value="html">
                        <div className="px-1.5 py-3 text-sm/6 font-normal">
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
                        </div>
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
