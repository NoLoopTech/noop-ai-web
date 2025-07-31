"use client"

import { JSX, useState } from "react"
import { Bell, Menu, Search, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sidebar } from "@/components/layout/Sidebar"

interface AdminNavBaseProps {
  children: React.ReactNode
}

export default function AdminNavBase({
  children
}: AdminNavBaseProps): JSX.Element {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 overflow-auto bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-white">
        <div className="flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-zinc-800 dark:bg-[#09090B]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              Overview
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="focus:ring-primary h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pr-4 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-1 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          {/* Render the actual page content instead of static content */}
          {children}
        </div>
      </div>
    </div>
  )
}
