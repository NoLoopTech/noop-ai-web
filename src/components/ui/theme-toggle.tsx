"use client"

import { JSX } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark")
      }}
      className="rounded-full"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-gray-700 transition-all dark:scale-0 dark:-rotate-90 dark:text-gray-300" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 text-gray-700 transition-all dark:scale-100 dark:rotate-0 dark:text-gray-300" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
