import type { JSX } from "react"
import { Montserrat } from "next/font/google"

import "@/app/globals.css"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata = {
  title: "Noopy – Powering Smart Conversations",
  description:
    "Manage your AI agents, chatbots, and client leads with Noopy's smart admin dashboard."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.className} bg-background text-foreground min-h-screen min-w-screen transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
