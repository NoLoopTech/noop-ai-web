import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"
import RegisterForm from "./register-contents/RegisterForm"
import Link from "next/link"
import { OnboardingSteps, useOnboardingStore } from "../store/onboarding.store"

const Register = () => {
  const setStep = useOnboardingStore(s => s.setStep)

  const handleNextStep = () => {
    setStep(OnboardingSteps.PRICING)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* Left side */}
      <div className="flex h-full w-full min-w-6/12 flex-col items-start justify-center">
        <div className="w-[480px]">
          <div className="flex w-full flex-col items-start justify-start space-y-2 py-10 text-left">
            <h2 className="text-2xl font-semibold text-zinc-950">
              Let's get started
            </h2>
            <p className="text-base text-zinc-500">
              Securely create your account in seconds.
            </p>
          </div>

          <div className="w-[480px]">
            <RegisterForm />
          </div>

          <div className="mt-6 flex w-full justify-center px-4">
            {/* TODO: instead of this button, form submission or google sign in should handle the next step to select the package */}
            <Button
              onClick={handleNextStep}
              className="w-full rounded-md bg-[#093AD7] hover:bg-[#093AD7]/60"
            >
              Sign up
            </Button>
          </div>

          <div className="mt-8 flex w-full flex-col items-center space-y-5 text-center text-sm text-[#7E7E7E]">
            <p>
              By sign up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <p>
              Already have an account?{" "}
              <Link href="/login" className="hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="relative flex h-full min-w-6/12 flex-col p-2">
        <div className="absolute top-8 right-9 z-10">
          <Image
            src="/assets/noopy-white-full.png"
            alt="Noopy Logo"
            width={168}
            height={37}
          />
        </div>

        <div className="relative flex-1 overflow-hidden rounded-lg">
          <Image
            src="/assets/images/onboarding-register-page-bg.jpg"
            alt="Register Page Background"
            fill
            className="object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[29%] to-black/50 to-[100%]" />
        </div>

        <div className="absolute inset-x-0 bottom-10 h-max w-full bg-transparent px-7">
          <h1 className="drop-black/25 w-full text-right text-5xl font-medium text-white drop-shadow-md">
            Your Gateway to Smarter Conversations
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Register
