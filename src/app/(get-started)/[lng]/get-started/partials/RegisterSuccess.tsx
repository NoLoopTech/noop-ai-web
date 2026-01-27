"use client"

import React from "react"
import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams
} from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"
import PartialSuccessIcon from "@/components/layout/animated-icons/PartialSuccessIcon"
import SuccessIcon from "@/components/layout/animated-icons/SuccessIcon"

const RegisterSuccess = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { status } = useSession()

  const setStep = useOnboardingStore(s => s.setStep)
  const pathname = usePathname()
  const params = useParams<{ lng?: string }>()
  const lng = params?.lng ?? pathname.split("/")[1] ?? "en"

  const verifiedParam = searchParams.get("verified")
  const isVerified = verifiedParam === "1" || status === "authenticated"

  const handleContinue = () => {
    setStep(OnboardingSteps.PRICING)
    // navigate back to onboarding with a post-auth step so the main flow picks it up
    const target = `/${lng}/get-started?postAuthStep=${OnboardingSteps.PRICING}`
    void router.push(target)
  }

  return (
    <div className="mx-auto flex h-screen max-w-lg items-center justify-center p-4">
      <div className="w-full rounded-lg border border-zinc-200/50 bg-white py-5 text-center shadow">
        {!isVerified ? (
          <div className="w-full max-w-lg p-8 text-center">
            <PartialSuccessIcon size={130} />
            <div className="mt-10 flex w-full flex-col items-center justify-center">
              <h2 className="text-foreground mb-5 text-3xl font-bold">
                You’re almost there!
              </h2>

              <p className="text-muted-foreground mb-4 max-w-lg text-lg">
                To complete your registration, please verify your email address
                using the link we just sent you.
              </p>

              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg p-8 text-center">
            <SuccessIcon size={130} />
            <div className="mt-10 flex w-full flex-col items-center justify-center">
              <h2 className="text-foreground mb-5 text-3xl font-bold">
                Email verified
              </h2>

              <p className="text-muted-foreground mb-4 max-w-lg text-lg">
                Your email is verified. Continue to complete onboarding.
              </p>

              <Button onClick={handleContinue} className="mt-3 h-11">
                Continue to Pricing
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterSuccess
