"use client"

import { useLayoutEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { OnboardingSteps, useOnboardingStore } from "./onboarding.store"

const POST_AUTH_STEP_KEY = "onboarding:postAuthStep"

export default function PostAuthStepHydrator() {
  const { status } = useSession()
  const setStep = useOnboardingStore(s => s.setStep)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ranRef = useRef(false)

  useLayoutEffect(() => {
    if (ranRef.current) return
    if (status !== "authenticated") return

    const fromUrl = searchParams.get("postAuthStep")
    const fromStorage =
      typeof window !== "undefined"
        ? sessionStorage.getItem(POST_AUTH_STEP_KEY)
        : null

    const next = fromUrl ?? fromStorage
    if (!next) return

    ranRef.current = true

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(POST_AUTH_STEP_KEY)
    }
    if (fromUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("postAuthStep")
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    }

    if (next === OnboardingSteps.PRICING || next === "pricing") {
      setStep(OnboardingSteps.PRICING)
    }
  }, [status, searchParams, pathname, router, setStep])

  return null
}
