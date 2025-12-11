"use client"

import React, { useEffect } from "react"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import AuthForm from "@/components/layout/auth/AuthForm"

const Register = () => {
  const setStep = useOnboardingStore(s => s.setStep)
  const { status } = useSession()
  const pathname = usePathname()

  const handleNextStep = () => {
    setStep(OnboardingSteps.PRICING)
  }

  useEffect(() => {
    if (status === "authenticated") {
      handleNextStep()
    }
  }, [status])

  return (
    <div className="relative flex h-screen w-full items-center justify-center p-2">
      <AuthForm
        mode="signup"
        onSuccess={handleNextStep}
        redirectTo={pathname}
      />
    </div>
  )
}

export default Register
