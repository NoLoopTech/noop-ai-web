"use client"

import React, { useEffect, useRef } from "react"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import AuthForm from "@/components/layout/auth/AuthForm"
import { useApiMutation } from "@/query"
import { toast } from "@/lib/hooks/useToast"

type ClaimAgentRequest = { chatBotCode: string }
type ClaimAgentResponse = {
  success: boolean
  projectId: number
  agentId: number | null
  message: string
}

const Register = () => {
  const setStep = useOnboardingStore(s => s.setStep)
  const chatBotCode = useOnboardingStore(s => s.chatBotCode)

  const { status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "onboarding:postAuthStep",
          OnboardingSteps.PRICING
        )
      } catch {}
    }
  }, [])

  const claimedRef = useRef(false)

  const { mutate: claimAgent } = useApiMutation<
    ClaimAgentResponse,
    ClaimAgentRequest
  >("/onboarding/claim-agent", "post", {
    onSuccess: () => {
      setStep(OnboardingSteps.PRICING)
    },
    onError: () => {
      claimedRef.current = false
      toast({
        variant: "error",
        title: "Could not claim your agent",
        description: "Please try again."
      })
    }
  })

  useEffect(() => {
    if (status !== "authenticated") return
    if (claimedRef.current) return

    if (!chatBotCode) {
      setStep(OnboardingSteps.PRICING)
      return
    }

    claimedRef.current = true
    claimAgent({ chatBotCode })
  }, [status, chatBotCode, setStep, claimAgent])

  const onSuccess = () => {
    router.push(`${pathname}/register-success`)
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center p-2">
      <AuthForm
        mode="signup"
        onSuccess={onSuccess}
        redirectTo={pathname}
        googleLoginProps={{
          postAuthStep: OnboardingSteps.PRICING,
          appendPostAuthStepToCallbackUrl: true
        }}
      />
    </div>
  )
}

export default Register
