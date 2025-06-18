import type { JSX } from "react"

import "@/app/globals.css"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
// import AdminNavBase from "@/components/layout/AdminNavBase"
import AutoSignOut from "@/components/layout/AutoSignOut"
import ReactQueryWrapper from "@/components/layout/ReactQueryWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
// import TopLoader from "@/components/layout/TopLoader"

export const metadata = {
  title: "Noopy AI Admin",
  description: "Noopy AI Admin Portal"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  return (
    <html lang="en">
      <body>
        {/* <TopLoader /> */}
        {/* <AdminNavBase /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <ReactQueryWrapper>{children}</ReactQueryWrapper>
            <AutoSignOut />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
