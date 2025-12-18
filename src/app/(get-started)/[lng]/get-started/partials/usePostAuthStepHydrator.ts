"use client"

import { useLayoutEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"

export const POST_AUTH_STEP_STORAGE_KEY = "onboarding:postAuthStep"
export const POST_AUTH_STEP_QUERY_PARAM = "postAuthStep"

export default function usePostAuthStepHydrator() {
  const { status } = useSession()
  const setStep = useOnboardingStore(s => s.setStep)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ranRef = useRef(false)

  useLayoutEffect(() => {
    if (ranRef.current) return
    if (status !== "authenticated") return

    const fromUrl = searchParams.get(POST_AUTH_STEP_QUERY_PARAM)
    const fromStorage =
      typeof window !== "undefined"
        ? sessionStorage.getItem(POST_AUTH_STEP_STORAGE_KEY)
        : null

    const next = fromUrl ?? fromStorage
    if (!next) return

    ranRef.current = true

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(POST_AUTH_STEP_STORAGE_KEY)
    }

    if (fromUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(POST_AUTH_STEP_QUERY_PARAM)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    }

    if (next === OnboardingSteps.PRICING) {
      setStep(OnboardingSteps.PRICING)
    }
  }, [status, searchParams, pathname, router, setStep])

  return null
}
