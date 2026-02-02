import AuthForm from "@/components/layout/auth/AuthForm"
import { JSX } from "react"

export default function Page(): JSX.Element {
  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center">
      <AuthForm mode="signin" enableSessionRedirect redirectTo="/admin" dark />
    </div>
  )
}
