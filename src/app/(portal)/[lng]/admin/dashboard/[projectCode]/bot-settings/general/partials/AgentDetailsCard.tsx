"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { format } from "date-fns"
import { IconCopy } from "@tabler/icons-react"

interface AgentDetailsCardProps {
  currentProject?: {
    id: number
    projectName: string
    code: string
    chatbotCode: string
    createdAt: string
  }
  isUserProjectsLoading: boolean
}

const AgentDetailsCard = ({
  currentProject,
  isUserProjectsLoading
}: AgentDetailsCardProps) => {
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

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
    <Card>
      <CardHeader>
        <CardTitle>Agent Details</CardTitle>
        <CardDescription>
          Key agent details, including its display name, system ID, and storage
          allocation.
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
            <p className="text-sm font-medium">Created On</p>
            <div className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400 dark:border-slate-800 dark:bg-transparent">
              {isUserProjectsLoading ? (
                <p className="shine-text">Loading...</p>
              ) : (
                <p>{format(currentProject?.createdAt ?? "", "MMM d,yyyy")}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentDetailsCard
