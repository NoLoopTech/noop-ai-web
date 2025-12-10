"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { JSX, useState } from "react"

export default function GoogleLogin(): JSX.Element {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async (): Promise<void> => {
    if (loading) return
    setLoading(true)
    try {
      await signIn("google", { redirect: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center pb-2">
      <Button
        onClick={handleGoogleLogin}
        disabled={loading}
        variant={"outline"}
        className="w-full"
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>
    </div>
  )
}
