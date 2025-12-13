"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { JSX, useState } from "react"
import GoogleIcon from "@/../public/assets/icons/google-logo-icon.svg"

export interface GoogleLoginProps {
  type?: "signin" | "signup"
  callbackUrl?: string
  postAuthStep?: string
  postAuthStorageKey?: string
  appendPostAuthStepToCallbackUrl?: boolean
  onBeforeRedirect?: () => void
}

export default function GoogleLogin({
  type = "signin",
  callbackUrl,
  postAuthStep,
  postAuthStorageKey = "onboarding:postAuthStep",
  appendPostAuthStepToCallbackUrl = true,
  onBeforeRedirect
}: GoogleLoginProps): JSX.Element {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async (): Promise<void> => {
    if (loading) return
    setLoading(true)

    try {
      if (typeof window !== "undefined" && postAuthStep) {
        sessionStorage.setItem(postAuthStorageKey, postAuthStep)
      }

      const baseCallbackUrl =
        callbackUrl ??
        (typeof window !== "undefined" ? window.location.href : "/")

      const resolvedCallbackUrl =
        typeof window !== "undefined" &&
        postAuthStep &&
        appendPostAuthStepToCallbackUrl
          ? (() => {
              const url = new URL(baseCallbackUrl, window.location.origin)
              url.searchParams.set("postAuthStep", postAuthStep)
              return url.toString()
            })()
          : baseCallbackUrl

      onBeforeRedirect?.()

      await signIn("google", { callbackUrl: resolvedCallbackUrl })
    } finally {
      setLoading(false)
    }
  }

  const buttonText =
    type === "signin" ? "Sign in with Google" : "Sign up with Google"
  const loadingText = type === "signin" ? "Signing in..." : "Signing up..."

  return (
    <div className="flex h-10 w-full flex-col items-center pb-2">
      <Button
        onClick={handleGoogleLogin}
        disabled={loading}
        variant={"outline"}
        className="w-full"
      >
        <GoogleIcon className="mr-1 h-4 w-4" />
        <span>{loading ? loadingText : buttonText}</span>
      </Button>
    </div>
  )
}
