import type { JSX } from "react"
import AdminNavBase from "@/components/layout/AdminNavBase"

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  return <AdminNavBase>{children}</AdminNavBase>
}
