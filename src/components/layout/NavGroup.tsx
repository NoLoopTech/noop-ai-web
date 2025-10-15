"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"
import { Badge } from "../ui/badge"
import { NavItem, type NavGroup } from "../../types/sidebar"

interface NavGroupProps extends NavGroup {
  prefix: string
}

export function NavGroup({ title, items, prefix }: NavGroupProps) {
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const path = pathname ?? ""
  const groupActive = items.some(item => checkIsActive(path, item, true))

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        data-active={groupActive}
        className={
          groupActive
            ? "text-sidebar-accent-foreground font-semibold"
            : undefined
        }
      >
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          if (!item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  // isActive={checkIsActive(pathname, item, true)}
                  isActive={checkIsActive(path, item, true)}
                  tooltip={item.title}
                >
                  <Link
                    href={prefix + item.url}
                    onClick={() => setOpenMobile(false)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              // defaultOpen={checkIsActive(pathname, item, true)}
              defaultOpen={checkIsActive(path, item, true)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={checkIsActive(path, item, true)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                  <SidebarMenuSub>
                    {item.items.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          // isActive={checkIsActive(pathname, subItem)}
                          isActive={checkIsActive(path, subItem)}
                        >
                          <Link
                            href={prefix + subItem.url}
                            onClick={() => setOpenMobile(false)}
                          >
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <NavBadge>{subItem.badge}</NavBadge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
)

// function checkIsActive(href: string, item: NavItem, mainNav = false) {
//   return (
//     href === item.url || // /endpint?search=param
//     href.split("?")[0] === item.url || // endpoint
//     !!item?.items?.filter(i => i.url === href).length || // if child nav is active
//     (mainNav &&
//       href.split("/")[1] !== "" &&
//       href.split("/")[1] === item?.url?.split("/")[1])
//   )
// }

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const normalize = (u?: string) => (u ?? "").split("?")[0].replace(/\/$/, "")

  const path = normalize(href)
  const itemUrl = normalize(item.url)

  // exact match or trailing match (works with prefixed routes like /en/admin/...)
  if (itemUrl && (path === itemUrl || path.endsWith(itemUrl))) return true

  // check children URLs
  if (item.items) {
    for (const child of item.items) {
      const childUrl = normalize(child.url)
      if (childUrl && (path === childUrl || path.endsWith(childUrl)))
        return true
    }
  }

  // fallback: for main nav groups try to match first path segment (e.g. "chats" in /en/.../chats)
  if (mainNav && itemUrl) {
    const pathFirst = path.split("/").filter(Boolean)[0]
    const itemFirst = itemUrl.split("/").filter(Boolean)[0]
    if (pathFirst && itemFirst && pathFirst === itemFirst) return true
  }

  return false
}
