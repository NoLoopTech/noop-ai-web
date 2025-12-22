"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { JSX, useState } from "react"
import GoogleIcon from "@/../public/assets/icons/google-logo-icon.svg"
import { toast } from "@/lib/hooks/useToast"
import {
  POST_AUTH_STEP_QUERY_PARAM,
  POST_AUTH_STEP_STORAGE_KEY
} from "@/app/(get-started)/[lng]/get-started/partials/hooks/usePostAuthStepHydrator"

export interface GoogleLoginProps {
  type?: "signin" | "signup"
  callbackUrl?: string
  postAuthStep?: string
  appendPostAuthStepToCallbackUrl?: boolean
  onBeforeRedirect?: () => void
}

export default function GoogleLogin({
  type = "signin",
  callbackUrl,
  postAuthStep,
  appendPostAuthStepToCallbackUrl = true,
  onBeforeRedirect
}: GoogleLoginProps): JSX.Element {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async (): Promise<void> => {
    if (loading) return
    setLoading(true)

    try {
      if (typeof window !== "undefined" && postAuthStep) {
        sessionStorage.setItem(POST_AUTH_STEP_STORAGE_KEY, postAuthStep)
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
              url.searchParams.set(POST_AUTH_STEP_QUERY_PARAM, postAuthStep)
              return url.toString()
            })()
          : baseCallbackUrl

      onBeforeRedirect?.()

      const result = await signIn("google", {
        callbackUrl: resolvedCallbackUrl,
        redirect: false
      })

      if (result?.error || result?.ok === false) {
        toast({
          variant: "error",
          title: "Google sign-in failed",
          description: "Please try again."
        })
        return
      }

      if (result?.url) {
        window.location.href = result.url
      }
    } catch (_error) {
      toast({
        variant: "error",
        title: "Could not sign in",
        description: "Please check your connection and try again."
      })
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
