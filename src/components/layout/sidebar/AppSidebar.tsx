"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/NavGroup"
import { NavUser } from "@/components/layout/NavUser"
import { useParams } from "next/navigation"
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { ProjectSwitcher } from "../ProjectSwitcher"
import { sidebarData } from "./SidebarData"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams()

  const projectId = useProjectCode()

  // INFO: Get the projectCode from route params (could be chatbotCode or numeric id)
  const projectCodeFromParams = params.projectCode as string | undefined

  const lng = (params.lng as string) ?? "en"

  // INFO: Use the projectCode from params (chatbotCode like "noopy") instead of numeric projectId
  const projectSegment = projectCodeFromParams ?? String(projectId ?? 0)
  const prefix = `/${lng}/admin/dashboard/${projectSegment}`

  return (
    <div className="relative">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <ProjectSwitcher />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map(props => (
            <NavGroup key={props.title} {...props} prefix={prefix} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}
