import "@/app/globals.css"
import "@/styles/typography.css"
import { dir } from "i18next"
import { Inter } from "next/font/google"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import ReactQueryWrapper from "@/components/layout/ReactQueryWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import NavBase from "@/components/layout/NavBase"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Noopy AI",
  description: "Noopy AI"
}

export default async function RootLayout({
  children,
  params: { lng }
}: {
  children: React.ReactNode
  params: { lng: string }
}): Promise<JSX.Element> {
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
