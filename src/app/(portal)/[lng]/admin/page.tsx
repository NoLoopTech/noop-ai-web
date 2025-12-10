import { JSX } from "react"
import { redirect } from "next/navigation"
import apiCaller from "@/lib/apiCaller"
import { type UserProject } from "@/models/project"

export default async function AdminPage(): Promise<JSX.Element> {
  const userData = await apiCaller<UserProject[], { iosDeviceToken: string }>({
    url: "user/me/projects",
    method: "GET"
  })

  const first = userData[0]
  const fallbackCode = "no-project"

  if (!first?.chatbotCode) {
    return redirect(`/admin/dashboard/${fallbackCode}/overview`)
  }

  redirect(`/admin/dashboard/${first.chatbotCode}/overview`)
}
