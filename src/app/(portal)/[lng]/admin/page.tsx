import { redirect } from "next/navigation"

export default async function AdminPage(): Promise<JSX.Element> {
  redirect("/admin/dashboard/overview")
}
