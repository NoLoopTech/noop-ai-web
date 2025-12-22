"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  OnboardingSteps,
  useOnboardingStore
} from "../../store/onboarding.store"

export const POST_AUTH_STEP_STORAGE_KEY = "onboarding:postAuthStep"
export const POST_AUTH_STEP_QUERY_PARAM = "postAuthStep"

const isOnboardingStep = (value: unknown): value is OnboardingSteps =>
  typeof value === "string" &&
  (Object.values(OnboardingSteps) as string[]).includes(value)

const isSupportedPostAuthStep = (step: OnboardingSteps): boolean =>
  step === OnboardingSteps.PRICING

export default function usePostAuthStepHydrator() {
  const { status } = useSession()
  const setStep = useOnboardingStore(s => s.setStep)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    if (status !== "authenticated") return
    const fromUrl = searchParams.get(POST_AUTH_STEP_QUERY_PARAM)
    const fromStorage =
      typeof window !== "undefined"
        ? sessionStorage.getItem(POST_AUTH_STEP_STORAGE_KEY)
        : null

    const fromUrlStep = isOnboardingStep(fromUrl) ? fromUrl : null
    const fromStorageStep = isOnboardingStep(fromStorage) ? fromStorage : null
    const next = fromUrlStep ?? fromStorageStep

    if (!next) {
      return
    }

    if (!isSupportedPostAuthStep(next)) {
      return
    }

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

    setStep(next)
  }, [status, searchParams, pathname, router, setStep])
}
