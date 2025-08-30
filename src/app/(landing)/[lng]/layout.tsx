import "@/app/globals.css"
import "@/styles/typography.css"
import { dir } from "i18next"
// import { languages } from "@/i18n/settings"
import { Inter } from "next/font/google"
import { FooterBase } from "@/components/layout/FooterBase"
import NavBase from "@/components/layout/NavBase"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import { JSX } from "react"
import { useTranslation as translation } from "@/i18n"

const inter = Inter({ subsets: ["latin"] })

// export async function generateStaticParams(): Promise<
//   Array<Record<string, string>>
// > {
//   return languages.map(lng => ({ lng }))
// }

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
  const { t } = await translation(lng, "footer")

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <NavBase />
            {children}
            <FooterBase lng={lng} t={t} />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
