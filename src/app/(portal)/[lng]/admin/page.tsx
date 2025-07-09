import { redirect } from "next/navigation"
import apiCaller from "@/lib/apiCaller"
import { type UserProject } from "@/models/project"

export default async function AdminPage(): Promise<JSX.Element> {
  const userData = await apiCaller<UserProject[], { iosDeviceToken: string }>({
    url: "bot/projects/me",
    method: "GET"
  })

  redirect(`/admin/dashboard/${userData[0].id}/overview`)
}
