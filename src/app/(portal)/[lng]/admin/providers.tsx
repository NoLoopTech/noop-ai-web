"use client"

import { useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"
import ReactQueryWrapper from "@/components/layout/ReactQueryWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import SearchProvider from "@/components/layout/SearchProvider"

interface Props {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <ReactQueryWrapper>
          <SearchProvider value={{ open, setOpen }}>{children}</SearchProvider>
        </ReactQueryWrapper>
      </SessionProvider>
    </ThemeProvider>
  )
}
