import AuthForm from "@/components/layout/auth/AuthForm"
import { JSX } from "react"

export default async function Page({
  params
}: {
  params: Promise<{ lng: string }>
}): Promise<JSX.Element> {
  const { lng } = await params

  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center">
      <AuthForm
        mode="signin"
        enableSessionRedirect
        redirectTo="/admin"
        switchModeRoutes={{ signup: `/${lng}/register` }}
        dark
      />
    </div>
  )
}
