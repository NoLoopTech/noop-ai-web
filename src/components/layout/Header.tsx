"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitch } from "@/components/ThemeSwitch"
import { usePathname } from "next/navigation"
import Link from "next/link"
// import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../ui/breadcrumb"
import React from "react"

export function Header() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const dashboardIdx = segments.findIndex(seg => seg === "dashboard")
  const projectCodeIdx = dashboardIdx + 1
  const afterProject = segments.slice(projectCodeIdx + 1)
  const basePath = "/" + segments.slice(0, projectCodeIdx + 1).join("/")

  const specialCases: Record<string, string> = {
    chats: "Chats",
    "chats/[id]": "Chat Room",
    leads: "Leads",
    "leads/[id]": "Transcript",
    tickets: "Tickets",
    "tickets/[id]": "Transcript"
  }

  const capitalize = (str: string) =>
    str.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())

  const breadcrumbs = afterProject.map((seg, idx) => {
    const currentPath = afterProject.slice(0, idx + 1)
    const isLast = idx === afterProject.length - 1

    const pathPattern =
      isLast && idx > 0
        ? `${afterProject[idx - 1]}/[id]`
        : currentPath.join("/")

    const omitBotSettings = seg.includes("bot-settings")
    const disableLink = !isLast && omitBotSettings

    const label = specialCases[pathPattern] || capitalize(seg)
    // const href = isLast ? undefined : `${basePath}/${currentPath.join("/")}`
    const href = disableLink
      ? undefined
      : isLast
        ? undefined
        : `${basePath}/${currentPath.join("/")}`
    return { label, href }
  })

  return (
    <header
      className={cn(
        "bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4",
        "sticky top-0"
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex w-full items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeSwitch />
      </div>
    </header>
  )
}
