"use client"

import { useMemo } from "react"
import AgentDetails from "./partials/AgentDetails"
import ChatBoxPreview from "./partials/ChatBoxPreview"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { useApiQuery } from "@/query"
import { UserProject } from "@/models/project"

interface PlaygroundProps {
  title?: string
  description?: string
}

const Playground = ({ title, description }: PlaygroundProps) => {
  const projectId = useProjectCode()

  const { data: userProjects } = useApiQuery<UserProject[]>(
    ["user-projects-playground"],
    `user/me/projects`,
    () => ({ method: "get" })
  )

  const project = useMemo(() => {
    const projects = userProjects ?? []
    const mapped = projects.map((project, index) => ({
      id: project.id,
      projectName: project.projectName ?? `Project ${index + 1}`,
      chatbotCode: project.chatbotCode ?? ""
    }))

    const current = mapped.find(p => p.id === projectId)

    return current || { projectName: "", chatbotCode: "" }
  }, [title, userProjects, projectId])

  return (
    <div className="flex w-full flex-col justify-between px-5 pt-5">
      <div className="flex w-full flex-col space-y-0.5">
        <h2 className="text-foreground text-2xl font-semibold">
          {title || "Playground"}
        </h2>
        <p className="text-muted-foreground text-base font-medium">
          {description ||
            "Simulate real conversations with your AI agent to verify its functionality and response quality."}
        </p>
      </div>

      <div className="flex h-[calc(100vh-10.5rem)] w-full items-start justify-evenly space-x-5 rounded-t-md bg-zinc-200 bg-[url('/assets/images/bot-settings-playground-bg.png')] bg-cover bg-center px-12 py-5 dark:bg-slate-950">
        <AgentDetails project={project} agentPrompt="" />

        <ChatBoxPreview project={project} />
      </div>
    </div>
  )
}

export default Playground
