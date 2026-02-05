import AuthForm from "@/components/layout/auth/AuthForm"
import { JSX } from "react"

export default function Page({
  params
}: {
  params: { lng: string }
}): JSX.Element {
  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center">
      <AuthForm
        mode="signin"
        enableSessionRedirect
        redirectTo="/admin"
        switchModeRoutes={{ signup: `/${params.lng}/register` }}
        dark
      />
    </div>
  )
}
