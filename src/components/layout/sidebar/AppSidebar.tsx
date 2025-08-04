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
import { useProjectId } from "@/lib/hooks/useProjectId"
import { ProjectSwitcher } from "../ProjectSwitcher"
import { sidebarData } from "./SidebarData"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams()

  const projectId = useProjectId()

  const lng = (params.lng as string) ?? "en"
  const prefix = `/${lng}/admin/dashboard/${projectId ?? 0}`

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
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}
