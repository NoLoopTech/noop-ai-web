import "@/app/globals.css"
import "@/styles/typography.css"
import { dir } from "i18next"
import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/layout/ThemeProvider"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import { JSX } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Noopy – Powering Smart Conversations",
  description:
    "Manage your AI agents, chatbots, and client leads with Noopy's smart admin dashboard."
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lng: string }>
}

export default async function RootLayout({
  children,
  params
}: LayoutProps): Promise<JSX.Element> {
  const { lng } = await params

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`${inter.className}`}>
        {/* INFO: ThemeProvider is commented out because we don't have a proper dark theme design for this section yet */}
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        <NextAuthProvider>{children}</NextAuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
