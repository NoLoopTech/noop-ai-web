import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"
import "react-day-picker/dist/style.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Noopy – Powering Smart Conversations",
  description:
    "Manage your AI agents, chatbots, and client leads with Noopy's smart admin dashboard."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} group/body antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
