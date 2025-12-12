import AuthForm from "@/components/layout/auth/AuthForm"
import { authOptions } from "@/lib/nextAuthOptions"
import { roleRedirectMap } from "@/lib/roleRedirectMap"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { JSX } from "react"

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  if (session?.user?.role) {
    redirect(roleRedirectMap[session.user.role] ?? "/admin")
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1440px] items-center justify-center p-2 px-20">
      <AuthForm mode="signin" redirectTo="/admin" dark />
    </div>
  )
}
