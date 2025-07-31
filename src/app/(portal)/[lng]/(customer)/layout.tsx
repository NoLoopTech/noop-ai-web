import "@/app/globals.css"
import "@/styles/typography.css"
import { dir } from "i18next"
import { Inter } from "next/font/google"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import ReactQueryWrapper from "@/components/layout/ReactQueryWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import NavBase from "@/components/layout/NavBase"
import { JSX } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Noopy AI",
  description: "Noopy AI"
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
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <ReactQueryWrapper>
              <NavBase />
              {children}
            </ReactQueryWrapper>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
