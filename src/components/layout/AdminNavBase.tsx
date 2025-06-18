"use client"

import { useState } from "react"
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
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white">
        <div className="w-full border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#09090B] h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }}
              className="h-8 w-8 rounded-md flex items-center justify-center border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              Overview
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 w-64 rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 pl-9 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800">
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
