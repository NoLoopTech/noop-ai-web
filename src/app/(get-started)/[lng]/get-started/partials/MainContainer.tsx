"use client"

import TabContainer from "./TabContainer"
import AgentPlayground from "./AgentPlayground"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"
import Register from "./Register"
import PricingContainer from "./PricingContainer"
import Image from "next/image"
import usePostAuthStepHydrator from "./hooks/usePostAuthStepHydrator"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import useClaimAgentAfterAuth from "./hooks/useClaimAgentAfterAuth"

const MainContainer = () => {
  const step = useOnboardingStore(s => s.step)

  const searchParams = useSearchParams()
  const { status } = useSession()

  usePostAuthStepHydrator()
  useClaimAgentAfterAuth()

  const postAuthStep = searchParams.get("postAuthStep")
  const isPostAuthRedirect = Boolean(postAuthStep)

  if (
    isPostAuthRedirect &&
    step !== OnboardingSteps.PRICING &&
    status !== "unauthenticated"
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h2 className="text-center text-2xl font-semibold text-zinc-950">
          Redirecting...
        </h2>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="w-full">
        {step !== OnboardingSteps.REGISTER && (
          <div className="mt-6 flex w-full justify-start">
            <Image
              src="/assets/noopy-blue-full.png"
              alt="Noopy Logo"
              width={150}
              height={33}
            />
          </div>
        )}

        {step !== OnboardingSteps.REGISTER &&
          step !== OnboardingSteps.PRICING && (
            <div className="flex w-full flex-col items-center justify-start space-y-3 py-6 text-center">
              <h2 className="text-2xl font-semibold text-zinc-950">
                Let’s feed your agent some knowledge!
              </h2>
              <p className="text-base text-zinc-500">
                Upload your files, paste a link, or simply type in text—your
                agent will instantly start learning from it.
              </p>
            </div>
          )}

        {step === OnboardingSteps.PRICING && (
          <div className="flex w-full flex-col items-center justify-start space-y-3 py-6 text-center">
            <h2 className="text-3xl font-semibold text-zinc-950">
              Power up your agent with the right plan
            </h2>
            <p className="text-base font-normal text-gray-600">
              Transparent pricing designed for individuals, startups, and
              enterprises.
            </p>
          </div>
        )}
      </div>

      <div className="w-full">
        {step === OnboardingSteps.TAB && <TabContainer />}
        {step === OnboardingSteps.PLAYGROUND && <AgentPlayground />}
        {step === OnboardingSteps.REGISTER && <Register />}
        {step === OnboardingSteps.PRICING && <PricingContainer />}
      </div>
    </div>
  )
}

export default MainContainer
