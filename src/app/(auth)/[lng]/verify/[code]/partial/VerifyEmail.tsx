"use client"

import { signIn, useSession } from "next-auth/react"
import { redirect, useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { POST_AUTH_STEP_STORAGE_KEY } from "@/app/(get-started)/[lng]/get-started/partials/hooks/usePostAuthStepHydrator"
import triggerNextAuthSessionRefresh from "@/lib/triggerNextAuthSessionRefresh"

const VerifyEmail = ({ code }: { code: string }) => {
  const { data: session } = useSession()
  const params = useParams<{ lng?: string }>()
  const lng = params?.lng ?? "en"
  const isOnboardingAttempt =
    typeof window !== "undefined" &&
    (sessionStorage.getItem(POST_AUTH_STEP_STORAGE_KEY) === "pricing" ||
      localStorage.getItem(POST_AUTH_STEP_STORAGE_KEY) === "pricing")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      if (isOnboardingAttempt) {
        redirect(`/${lng}/get-started/register-success?verified=1`)
      } else {
        redirect("/admin")
      }
    }
  }, [session])

  const verifyCode = async (): Promise<void> => {
    const callbackUrl = isOnboardingAttempt
      ? `/${lng}/get-started/register-success?verified=1`
      : "/admin"

    const signInResponse = await signIn("emailverify", {
      callbackUrl,
      redirect: false,
      code
    })

    if (!signInResponse?.ok) {
      setError("Invalid link or link has expired")
      return
    }

    try {
      triggerNextAuthSessionRefresh()
    } catch {}

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(POST_AUTH_STEP_STORAGE_KEY)
        localStorage.removeItem(POST_AUTH_STEP_STORAGE_KEY)
      } catch {}
      window.location.href = callbackUrl
    }
  }

  useEffect(() => {
    void verifyCode()
  }, [code])

  return (
    <main className="flex w-full items-center justify-center pt-24">
      {!error && (
        <p className="shine-text text-lg">You are being redirected...</p>
      )}

      {error ? <p>{error}</p> : null}
    </main>
  )
}

export default VerifyEmail
