import type { JSX } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import NextAuthProvider from "@/components/layout/NextAuthProvider"
// import NavBase from "@/components/layout/NavBase"
import ReactQueryWrapper from "@/components/layout/ReactQueryWrapper"
// import TopLoader from "@/components/layout/TopLoader"
import { authOptions } from "@/lib/nextAuthOptions"
import { roleRedirectMap } from "@/lib/roleRedirectMap"

import "@/app/globals.css"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

export const metadata = {
  title: "Noopy AI",
  description: "Noopy AI"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)
  if (session) {
    return redirect(roleRedirectMap[session.user?.role] ?? "/")
  }

  return (
    <html lang="en">
      <body>
        {/* <TopLoader /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <ReactQueryWrapper>
              {/* <NavBase /> */}
              {children}
            </ReactQueryWrapper>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
