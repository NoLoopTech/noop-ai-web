"use client"

import { useState, useEffect, useMemo, useRef, type RefObject } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useApiQuery } from "@/query"
import { type UserProject } from "@/models/project"

interface UseProjectSwitcherReturn {
  isUserProjectsLoading: boolean
  selectedProjectId: number | undefined
  isProjectSwitcherOpen: boolean
  projectSwitcherRef: RefObject<HTMLDivElement>
  memoizedProjects: Array<{ id: number; chatbotCode: string }>
  selectedProjectChatbotCode: string
  handleProjectsSwitcher: () => void
  handleSelectProject: (projectId: number) => void
}

export const useProjectSwitcher = (): UseProjectSwitcherReturn => {
  const pathname = usePathname()
  const router = useRouter()

  const { data: userProjects, isLoading: isUserProjectsLoading } = useApiQuery<
    UserProject[]
  >(["user-projects"], `bot/projects/me`, () => ({
    method: "get"
  }))

  const [selectedProjectId, setSelectedProjectId] = useState<number>()
  const [isProjectSwitcherOpen, setProjectSwitcherOpen] = useState(false)
  const projectSwitcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userProjects && userProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(userProjects[0].id)
    }
  }, [userProjects, selectedProjectId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        projectSwitcherRef.current &&
        !projectSwitcherRef.current.contains(event.target as Node)
      ) {
        setProjectSwitcherOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const memoizedProjects = useMemo(() => {
    const projects = userProjects ?? []
    return Array.from({ length: Math.max(3, projects.length) }).map(
      (_, index) => {
        const project = projects[index]
        return {
          id: project?.id ?? index,
          chatbotCode: project?.chatbotCode ?? `Project ${index + 1}`
        }
      }
    )
  }, [userProjects])

  const selectedProjectChatbotCode =
    memoizedProjects.find(p => p.id === selectedProjectId)?.chatbotCode ??
    "Select Project"

  const handleProjectsSwitcher = (): void => {
    setProjectSwitcherOpen(prev => !prev)
  }

  const handleSelectProject = (projectId: number): void => {
    setSelectedProjectId(projectId)
    setProjectSwitcherOpen(false)

    const pathParts = pathname.split("/").filter(p => p)
    if (pathParts.length >= 4) {
      const currentPage = pathParts.slice(4).join("/")
      const newPath = `/${pathParts[0]}/admin/dashboard/${projectId}/${currentPage}`
      router.push(newPath)
    }
  }

  return {
    isUserProjectsLoading,
    selectedProjectId,
    isProjectSwitcherOpen,
    projectSwitcherRef,
    memoizedProjects,
    selectedProjectChatbotCode,
    handleProjectsSwitcher,
    handleSelectProject
  }
}
