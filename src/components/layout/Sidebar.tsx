"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams, usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  ChevronDown,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Store,
  CreditCard,
  User,
  Users,
  Ticket,
  Link as LinkIcon,
  HelpCircle,
  LogOut,
  Bell
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect, useMemo, useTransition, JSX } from "react"
import { useApiQuery } from "@/query"
import { type UserProject } from "@/models/project"

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

// Helper function to generate consistent color based on name
const getColorFromName = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500"
  ]

  // Simple hash function to get consistent color for same name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Get positive value and map to color array index
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Helper function to get initials from a name - improved for better handling of various name formats
const getInitials = (name: string): string => {
  if (!name || typeof name !== "string") return "A"

  // Trim whitespace and handle empty names
  const trimmedName = name.trim()
  if (!trimmedName) return "A"

  // Split by any whitespace characters
  const parts = trimmedName.split(/\s+/).filter(part => part.length > 0)

  if (parts.length === 0) return "A"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  // Get first letter of first name and first letter of last name
  const firstInitial = parts[0].charAt(0)
  const lastInitial = parts[parts.length - 1].charAt(0)

  return (firstInitial + lastInitial).toUpperCase()
}

export function Sidebar({
  isCollapsed
  // setIsCollapsed
}: SidebarProps): JSX.Element {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const [isProjectSwitcherOpen, setProjectSwitcherOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { data: userProjects, isLoading: isUserProjectsLoading } = useApiQuery<
    UserProject[]
  >(
    ["user-projects"],
    `user/me/projects`,
    () => ({
      method: "get"
    }),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  )

  const selectedProjectId = useMemo(() => {
    const projectIdFromParams = params.projectId as string
    if (projectIdFromParams) {
      const projectId = parseInt(projectIdFromParams, 10)
      return !isNaN(projectId) ? projectId : undefined
    }
    return undefined
  }, [params.projectId])

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

  const handleSelectProject = (projectId: number): void => {
    setProjectSwitcherOpen(false)

    startTransition(() => {
      const pathParts = pathname.split("/").filter(p => p)
      if (pathParts.length >= 4) {
        const newPath = `/${prefix}/${projectId}/overview`
        router.push(newPath)
      }
    })
  }

  const projectSwitcherRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // State for mini profile dropdown position
  const [miniDropdownPosition, setMiniDropdownPosition] = useState({
    top: 0,
    left: 0
  })

  // Extract user information from session, handling both Google and custom auth
  const userInfo = useMemo(() => {
    // Default values
    let displayName = "Guest User"
    let email = ""
    let profileImage = null

    if (session?.user) {
      // For email - available in both auth types
      email = session.user.email ?? ""

      // For name - try different sources with fallbacks
      if ("name" in session.user && session.user.name) {
        displayName = session.user.name as string
      } else if (session.user.fullname) {
        displayName = session.user.fullname
      }

      // For profile image - check in multiple locations where NextAuth might store it
      if ("image" in session.user && session.user.image) {
        profileImage = session.user.image as string
      } else if ("picture" in session.user && session.user.picture) {
        profileImage = session.user.picture as string
      }
    }

    return {
      displayName,
      email,
      profileImage,
      initials: getInitials(displayName),
      color: getColorFromName(displayName)
    }
  }, [session])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Only close if the click is outside both the dropdown and the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }

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

  // Toggle dropdown function to handle opening and closing properly
  const toggleDropdown = (): void => {
    setDropdownOpen(prevState => !prevState)
  }

  // Handle logout
  const handleLogout = (): void => {
    void signOut({ callbackUrl: `/login` })
  }

  // Check if a route is active (current page)
  const isRouteActive = (routePath: string): boolean => {
    // Handle possible trailing slash variations
    const normalizedPathname = pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname
    const normalizedRoutePath = routePath.endsWith("/")
      ? routePath.slice(0, -1)
      : routePath

    // For overview specifically, we want to match /{lng}/overview with or without trailing slash
    if (routePath.includes(`/${prefix}/overview`)) {
      return normalizedPathname === normalizedRoutePath
    }

    // For all other routes, check if the normalized paths match
    return normalizedPathname === normalizedRoutePath
  }

  const routes = {
    workspace: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        href: `/${prefix}/${selectedProjectId ?? 0}/overview`
      },
      {
        title: "Chats",
        icon: MessageSquare,
        href: `/${prefix}/${selectedProjectId ?? 0}/chats`
      },
      {
        title: "Tickets",
        icon: Ticket,
        href: `/${prefix}/${selectedProjectId ?? 0}/tickets`
      },
      {
        title: "Leads",
        icon: User,
        href: `/${prefix}/${selectedProjectId ?? 0}/leads`
      },
      {
        title: "Analytics",
        icon: BarChart3,
        href: `/${prefix}/${selectedProjectId ?? 0}/analytics`
      },
      {
        title: "Integrations",
        icon: LinkIcon,
        href: `/${prefix}/${selectedProjectId ?? 0}/integrations`
      },
      {
        title: "Bot Settings",
        icon: Settings,
        href: `/${prefix}/${selectedProjectId ?? 0}/bot-settings`
      }
    ],
    management: [
      {
        title: "Team and Membership",
        icon: Users,
        href: `/${prefix}/${selectedProjectId ?? 0}/team`
      },
      {
        title: "Market Place",
        icon: Store,
        href: `/${prefix}/${selectedProjectId ?? 0}/market-place`
      },
      {
        title: "Plans & Billings",
        icon: CreditCard,
        href: `/${prefix}/${selectedProjectId ?? 0}/plans-billings`
      }
    ],
    support: [
      {
        title: "Help & Support",
        icon: HelpCircle,
        href: `/${prefix}/${selectedProjectId ?? 0}/help-support`
      },
      {
        title: "Settings",
        icon: Settings,
        href: `/${prefix}/${selectedProjectId ?? 0}/settings`
      }
    ]
  }

  const handleProjectsSwitcher = (): void => {
    setProjectSwitcherOpen(prev => !prev)
  }

  // Function to handle mini profile click
  const handleMiniProfileClick = (): void => {
    // Get button position for proper popup placement
    if (isCollapsed && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMiniDropdownPosition({
        top: rect.top,
        left: rect.right + 10 // Position to the right of the button with a small gap
      })
    }
    toggleDropdown()
  }

  return (
    <div
      className={cn(
        "m-2 flex flex-col rounded-lg shadow-md transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        "border border-gray-200 bg-white text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      )}
    >
      {/* Header with Logo and Title */}
      <div
        ref={projectSwitcherRef}
        onClick={handleProjectsSwitcher}
        className="relative flex h-16 cursor-pointer items-center justify-between border-b border-gray-200 px-4 dark:border-zinc-700"
      >
        {isUserProjectsLoading || isPending ? (
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700"></div>
            {!isCollapsed && (
              <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-zinc-700"></div>
            )}
          </div>
        ) : (
          <div className="flex w-full items-center justify-between space-x-1">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedProjectName}</span>
              </div>
            )}

            {isCollapsed && (
              <div className="flex w-full justify-center text-2xl font-bold">
                {selectedProjectName.charAt(0)}
              </div>
            )}

            <div className="flex h-5 w-5 items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isProjectSwitcherOpen && "-rotate-90"
                )}
              />
            </div>
          </div>
        )}

        <div
          className={`absolute top-0 z-10 max-w-full min-w-[230px] rounded-lg bg-white dark:bg-zinc-900 ${
            isProjectSwitcherOpen
              ? "border border-gray-200 shadow-lg dark:border-zinc-700"
              : ""
          } ${isCollapsed ? "-right-60" : "-right-60"}`}
        >
          {isProjectSwitcherOpen && (
            <div className="flex w-full flex-col space-y-1 p-1.5">
              {memoizedProjects.map(project => (
                <button
                  key={project.id}
                  onClick={e => {
                    e.stopPropagation()
                    handleSelectProject(project.id)
                  }}
                  className="w-full rounded-md p-1 pl-2.5 text-left text-gray-700 hover:bg-slate-200/60 dark:text-white dark:hover:bg-slate-200/10"
                >
                  {project.projectName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Workspace Section */}
        <div className="py-4">
          {!isCollapsed && (
            <div className="mb-3 px-3">
              <h2 className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Workspace
              </h2>
            </div>
          )}
          <div className="space-y-1">
            {routes.workspace.map(route => {
              const active = isRouteActive(route.href)
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground before:bg-primary relative before:absolute before:top-1/2 before:left-0 before:h-3/5 before:w-1 before:-translate-y-1/2 before:rounded-r-full"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-700/50 dark:hover:text-white",
                    isCollapsed ? "justify-center px-0" : "px-3"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active
                        ? "text-primary dark:text-primary"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        active
                          ? "text-primary dark:text-primary-foreground"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {route.title}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Management Section */}
        <div className="py-2">
          {!isCollapsed && (
            <div className="mb-3 px-3">
              <h2 className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Management
              </h2>
            </div>
          )}
          <div className="space-y-1">
            {routes.management.map(route => {
              const active = isRouteActive(route.href)
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground before:bg-primary relative before:absolute before:top-1/2 before:left-0 before:h-3/5 before:w-1 before:-translate-y-1/2 before:rounded-r-full"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-700/50 dark:hover:text-white",
                    isCollapsed ? "justify-center px-0" : "px-3"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active
                        ? "text-primary dark:text-primary"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        active
                          ? "text-primary dark:text-primary-foreground"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {route.title}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Support Center Section */}
        <div className="py-2">
          {!isCollapsed && (
            <div className="mb-3 px-3">
              <h2 className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Support Center
              </h2>
            </div>
          )}
          <div className="space-y-1">
            {routes.support.map(route => {
              const active = isRouteActive(route.href)
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground before:bg-primary relative before:absolute before:top-1/2 before:left-0 before:h-3/5 before:w-1 before:-translate-y-1/2 before:rounded-r-full"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-700/50 dark:hover:text-white",
                    isCollapsed ? "justify-center px-0" : "px-3"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active
                        ? "text-primary dark:text-primary"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        active
                          ? "text-primary dark:text-primary-foreground"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {route.title}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="relative mt-auto border-t border-gray-200 p-4 dark:border-zinc-700">
        <div
          className={cn(
            "flex items-center justify-between",
            isCollapsed && "flex-col gap-3"
          )}
        >
          <button
            ref={buttonRef}
            onClick={handleMiniProfileClick}
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "w-full gap-3"
            )}
          >
            {/* User Avatar - With error handling for image loading */}
            {userInfo.profileImage ? (
              <div className="h-9 w-9 overflow-hidden rounded-full">
                <Image
                  src={userInfo.profileImage}
                  alt={userInfo.displayName}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  onError={e => {
                    // If image fails to load, replace with initials avatar
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.classList.add(...userInfo.color.split(" "))
                      parent.innerHTML = `<div class="h-full w-full flex items-center justify-center text-white font-medium">${userInfo.initials}</div>`
                    }
                  }}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full font-medium text-white transition-all duration-300",
                  userInfo.color
                )}
              >
                {userInfo.initials}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="max-w-[160px] truncate text-sm font-medium text-gray-900 dark:text-white">
                  {userInfo.displayName}
                </p>
                <p className="max-w-[160px] truncate text-xs text-gray-500 dark:text-gray-400">
                  {userInfo.email}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 transition-transform duration-200 dark:text-gray-400",
                  dropdownOpen && "rotate-180 transform"
                )}
              />
            )}
          </button>

          {/* Theme toggle */}
          {isCollapsed && (
            <div className="mt-2">
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* User Dropdown Menu - Positioned differently based on sidebar state */}
        {dropdownOpen && !isCollapsed && (
          <div
            ref={dropdownRef}
            className="animate-fadeIn absolute bottom-0 left-full z-50 ml-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white py-0 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            {/* User Info Panel */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
              {userInfo.profileImage ? (
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={userInfo.profileImage}
                    alt={userInfo.displayName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    onError={e => {
                      // If image fails to load, replace with initials avatar
                      e.currentTarget.style.display = "none"
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.classList.add(...userInfo.color.split(" "))
                        parent.innerHTML = `<div class="h-full w-full flex items-center justify-center text-white font-medium">${userInfo.initials}</div>`
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-base font-medium text-white",
                    userInfo.color
                  )}
                >
                  {userInfo.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userInfo.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userInfo.email}
                </p>
              </div>
            </div>

            {/* Menu Options */}
            <div>
              <Link
                href={`/${prefix}/profile`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Profile</span>
              </Link>
              <Link
                href={`/${prefix}/billing`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Billing</span>
              </Link>
              <Link
                href={`/${prefix}/notifications`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Notifications</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        {/* Mini version dropdown - positioned absolutely to the viewport */}
        {dropdownOpen && isCollapsed && (
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${miniDropdownPosition.top}px`,
              left: `${miniDropdownPosition.left}px`
            }}
            className="animate-fadeIn z-50 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white py-0 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            {/* User Info Panel */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
              {userInfo.profileImage ? (
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={userInfo.profileImage}
                    alt={userInfo.displayName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    onError={e => {
                      // If image fails to load, replace with initials avatar
                      e.currentTarget.style.display = "none"
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.classList.add(...userInfo.color.split(" "))
                        parent.innerHTML = `<div class="h-full w-full flex items-center justify-center text-white font-medium">${userInfo.initials}</div>`
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-base font-medium text-white",
                    userInfo.color
                  )}
                >
                  {userInfo.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userInfo.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userInfo.email}
                </p>
              </div>
            </div>

            {/* Menu Options */}
            <div>
              <Link
                href={`/${prefix}/profile`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Profile</span>
              </Link>
              <Link
                href={`/${prefix}/billing`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Billing</span>
              </Link>
              <Link
                href={`/${prefix}/notifications`}
                className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                onClick={() => {
                  setDropdownOpen(false)
                }}
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Notifications</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
