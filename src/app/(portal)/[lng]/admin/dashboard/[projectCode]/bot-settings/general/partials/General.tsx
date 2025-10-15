"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { UserProject } from "@/models/project"
import { useApiQuery } from "@/query"
import { IconCopy, IconExclamationCircle } from "@tabler/icons-react"
import { format } from "date-fns"
import React, { useMemo, useState } from "react"
import Markdown from "react-markdown"

const General = () => {
  const [tab, setTab] = useState("html")
  const [isCreditsLimitingEnabled, setIsCreditsLimitingEnabled] =
    useState(false)
  const [integrationCodeCopied, setIntegrationCodeCopied] = useState(false)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

  const currentProjectId = useProjectCode()

  const { data: userProjects, isLoading: isUserProjectsLoading } = useApiQuery<
    UserProject[]
  >(["user-projects"], `user/me/projects`, () => ({
    method: "get"
  }))

  const memoizedProjects = useMemo(() => {
    const projects = userProjects ?? []
    return projects.map((project, index) => ({
      id: project.id,
      projectName: project.projectName ?? `Project ${index + 1}`,
      code: project.code,
      chatbotCode: project.chatbotCode,
      createdAt: project.createdAt
    }))
  }, [userProjects])

  const currentProject = memoizedProjects.find(p => p.id === currentProjectId)

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

  const copyApiKey = async () => {
    const code = currentProject?.code ?? ""
    try {
      await navigator.clipboard.writeText(code)
      setApiKeyCopied(true)
      setTimeout(() => setApiKeyCopied(false), 2000)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Copy failed", err)
    }
  }

  return (
    <section className="flex w-full flex-col py-4">
      <h2 className="mx-auto w-full max-w-4xl self-start text-left text-3xl font-semibold">
        General
      </h2>
      <ScrollArea className="mt-3 h-[calc(100vh_-_150px)] w-full">
        <div className="mx-auto mb-5 flex max-w-4xl flex-col space-y-7">
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
              <CardDescription>
                Key agent details, including its display name, system ID, and
                storage allocation.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full space-y-4">
              <div className="mb-5 flex w-max items-center space-x-4 rounded-lg bg-zinc-100 px-4 py-3 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500 text-2xl font-medium text-white dark:bg-slate-600">
                  <p>N</p>
                </div>
                <div className="flex h-full flex-col justify-between space-y-1">
                  <p className="text-foreground text-lg font-semibold">Noopy</p>
                  <p className="text-muted-foreground min-w-3xs text-sm">
                    Agent Id:{" "}
                    {isUserProjectsLoading ? (
                      <span className="shine-text">Loading...</span>
                    ) : (
                      <span>{currentProject?.code}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex w-full flex-col space-y-1.5">
                  <p className="text-sm font-medium">Agent Name</p>
                  <div className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400 dark:border-slate-800 dark:bg-transparent">
                    {isUserProjectsLoading ? (
                      <p className="shine-text">Loading...</p>
                    ) : (
                      <p>{currentProject?.projectName}</p>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col space-y-1.5">
                  <p className="text-sm font-medium">Agent Id</p>
                  <div className="flex w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400 dark:border-slate-800 dark:bg-transparent">
                    {isUserProjectsLoading ? (
                      <p className="shine-text">Loading...</p>
                    ) : (
                      <p>{currentProject?.code}</p>
                    )}
                    <IconCopy
                      onClick={copyApiKey}
                      className={`h-4 w-4 cursor-pointer transition-colors duration-500 ease-in-out ${apiKeyCopied ? "stroke-emerald-600 dark:stroke-emerald-600" : "stroke-zinc-400 hover:stroke-zinc-500 dark:stroke-zinc-500 dark:hover:stroke-zinc-700"}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex w-full flex-col space-y-1.5">
                  <p className="text-sm font-medium">Size</p>
                  <div className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400 dark:border-slate-800 dark:bg-transparent">
                    <p>(Coming Soon)</p>
                  </div>
                </div>

                <div className="flex w-full flex-col space-y-1.5">
                  <p className="text-sm font-medium">Agent Name</p>
                  <div className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400 dark:border-slate-800 dark:bg-transparent">
                    {isUserProjectsLoading ? (
                      <p className="shine-text">Loading...</p>
                    ) : (
                      <p>
                        {format(currentProject?.createdAt ?? "", "MMM d,yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                            {/* <div className="mr-1 h-max w-max cursor-pointer rounded-sm p-1 transition-colors duration-300 ease-in-out hover:bg-zinc-200/50 dark:hover:bg-zinc-700/80"> */}
                            <IconCopy
                              onClick={copyIntegrationCode}
                              className={`mr-1 h-5 w-5 cursor-pointer transition-colors duration-500 ease-in-out ${integrationCodeCopied ? "stroke-emerald-600 dark:stroke-emerald-600" : "stroke-zinc-400 hover:stroke-zinc-500 dark:stroke-zinc-500 dark:hover:stroke-zinc-700"}`}
                            />
                          </div>
                          {tab === "html" && (
                            <TabsContent value="html">
                              <div className="px-1.5 py-3 text-sm/6 font-normal">
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

          <Card>
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <CardTitle>
                    Credits limit{" "}
                    <span className="text-xs font-normal opacity-40">
                      (Coming Soon)
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Sets the credit usage cap for this agent, based on your
                    workspace’s available credits.
                  </CardDescription>
                </div>

                <Switch
                  disabled
                  onCheckedChange={setIsCreditsLimitingEnabled}
                />
              </div>
            </CardHeader>
            <CardContent className="w-full p-0">
              {isCreditsLimitingEnabled && (
                <div className="flex w-full flex-col space-y-2 p-5 pt-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                      Set credits limit on agent:
                    </p>
                    <IconExclamationCircle className="h-4 w-4 text-zinc-400" />
                  </div>

                  <div className="w-80 rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400">
                    <p>0</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center space-x-4 py-4">
            <h2 className="min-w-max text-xl font-semibold text-red-600">
              Danger Zone
            </h2>
            <div className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-700" />
          </div>

          <Card className="border border-red-600">
            <CardHeader>
              <CardTitle>Delete all conversations</CardTitle>
              <CardDescription>
                Deleting all conversations is permanent. This will remove every
                conversation linked to this agent—please proceed only if you're
                sure.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex w-full items-center justify-end">
              <Button variant="destructive" className="py-5">
                Delete Conversations
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-red-600">
            <CardHeader>
              <CardTitle>
                Delete agent{" "}
                <span className="text-xs font-normal opacity-40">
                  (Coming Soon)
                </span>
              </CardTitle>
              <CardDescription>
                Deleting your agent is permanent and cannot be undone. Please
                proceed only if you're sure.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex w-full items-center justify-end">
              <Button
                disabled
                variant="destructive"
                className="cursor-not-allowed py-5"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </section>
  )
}

export default General
