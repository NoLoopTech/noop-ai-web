"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { UserProject } from "@/models/project"
import { useApiQuery } from "@/query"
import React, { useMemo } from "react"
import DeleteAllConversationsCard from "./DeleteAllConversationsCard"
import AgentDetailsCard from "./AgentDetailsCard"
import { Separator } from "@/components/ui/separator"
import EmbedCodeCard from "./EmbedCodeCard"
import CreditLimitCard from "./CreditLimitCard"
import DeleteAgentCard from "./DeleteAgentCard"

const General = () => {
  const currentProjectId = useProjectCode()

  const { data: userProjects, isLoading: isUserProjectsLoading } = useApiQuery<
    UserProject[]
  >(["user-projects-bot-settings-general"], `user/me/projects`, () => ({
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

  return (
    <section className="flex w-full flex-col py-4 pr-2">
      <h2 className="mx-auto w-full max-w-4xl self-start px-5 text-left text-3xl font-semibold">
        General
      </h2>
      <ScrollArea className="mt-3 h-[calc(100vh_-_150px)] w-full px-5">
        <div className="mx-auto mb-5 flex max-w-4xl flex-col space-y-7">
          <AgentDetailsCard
            currentProject={currentProject}
            isUserProjectsLoading={isUserProjectsLoading}
          />

          <EmbedCodeCard
            currentProject={currentProject}
            isUserProjectsLoading={isUserProjectsLoading}
          />

          <CreditLimitCard />

          <div className="flex items-center space-x-4 py-4">
            <h2 className="min-w-max text-xl font-semibold text-red-600">
              Danger Zone
            </h2>
            <Separator className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
          </div>

          <DeleteAllConversationsCard currentProject={currentProject} />

          <DeleteAgentCard />
        </div>
      </ScrollArea>
    </section>
  )
}

export default General
