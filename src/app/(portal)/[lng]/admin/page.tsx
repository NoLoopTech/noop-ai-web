import { redirect } from "next/navigation"
import apiCaller from "@/lib/apiCaller"
import { type UserProject } from "@/models/project"
import { JSX } from "react"

export default async function AdminPage(): Promise<JSX.Element> {
  const userData = await apiCaller<UserProject[], { iosDeviceToken: string }>({
    url: "user/me/projects",
    method: "GET"
  })

  redirect(`/admin/dashboard/${userData[0].id}/overview`)
}
