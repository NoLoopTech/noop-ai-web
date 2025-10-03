"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { useApiQuery } from "@/query"
import { UserProject } from "@/models/project"
import { useParams, usePathname, useRouter } from "next/navigation"
import { IconBrandSketchFilled } from "@tabler/icons-react"
import { useProjectCode } from "@/lib/hooks/useProjectCode"

export function ProjectSwitcher() {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const { isMobile } = useSidebar()
  const [isPending, startTransition] = useTransition()

  const [isProjectSwitcherOpen, setProjectSwitcherOpen] = useState(false)
  const projectSwitcherRef = useRef<HTMLButtonElement>(null)

  const { data: userProjects, isLoading: isUserProjectsLoading } = useApiQuery<
    UserProject[]
  >(["user-projects"], `user/me/projects`, () => ({
    method: "get"
  }))

  const selectedProjectId = useProjectCode()

  const memoizedProjects = useMemo(() => {
    const projects = userProjects ?? []
    return projects.map((project, index) => ({
      id: project.id,
      projectName: project.projectName ?? `Project ${index + 1}`
    }))
  }, [userProjects])

  const selectedProjectName =
    memoizedProjects.find(p => p.id === selectedProjectId)?.projectName ??
    "Select Project"

  const lng = (params.lng as string) ?? "en"
  const prefix = `${lng}/admin/dashboard`

  // Toggle dropdown open/close
  const handleProjectsSwitcher = (): void => {
    setProjectSwitcherOpen(prev => !prev)
  }

  // Use transition and close dropdown on select
  const handleSelectProject = (projectId: number) => () => {
    setProjectSwitcherOpen(false)
    startTransition(() => {
      const pathParts = pathname.split("/").filter(p => p)
      if (pathParts.length >= 4) {
        const newPath = `/${prefix}/${projectId}/overview`
        router.push(newPath)
      }
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger ref={projectSwitcherRef} asChild>
            <SidebarMenuButton
              size="lg"
              className="ring-sidebar-primary/50 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-1"
              onClick={handleProjectsSwitcher}
            >
              {isUserProjectsLoading || isPending ? (
                <div className="flex w-full items-center space-x-2 px-2 py-5">
                  <div className="shine h-7 w-9 rounded-md"></div>
                  <div className="shine h-5 w-full rounded-sm"></div>
                </div>
              ) : (
                <>
                  <div className="text-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800">
                    <IconBrandSketchFilled className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold">
                      {selectedProjectName}
                    </span>
                    {/* <span className="truncate text-xs">{activeProject.plan}</span> */}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {!isUserProjectsLoading && isProjectSwitcherOpen && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Projects
              </DropdownMenuLabel>
              {memoizedProjects.map((project, index) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={handleSelectProject(project.id)}
                  className="gap-2 p-2 text-balance"
                >
                  {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <project.logo
                    className={cn(
                      "size-4 shrink-0",
                      index === 0 && "invert-0 dark:invert"
                    )}
                  />
                </div> */}
                  <IconBrandSketchFilled className="size-4" />
                  {project.projectName}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
