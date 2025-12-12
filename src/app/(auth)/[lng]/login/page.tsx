import AuthForm from "@/components/layout/auth/AuthForm"
import { JSX } from "react"

export default function Page(): JSX.Element {
  return (
    <div className="flex h-screen max-w-[1440px] items-center justify-center p-2 px-20">
      <AuthForm mode="signin" enableSessionRedirect redirectTo="/admin/" dark />
    </div>
  )
}
