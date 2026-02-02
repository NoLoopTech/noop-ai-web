"use client"

import { JSX, useState } from "react"
import AuthForm from "@/components/layout/auth/AuthForm"
import PartialSuccessIcon from "@/components/layout/animated-icons/PartialSuccessIcon"

export default function MainContainer(): JSX.Element {
  const [registered, setRegistered] = useState(false)

  const handleOnSuccess = () => {
    setRegistered(true)
  }

  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center">
      {registered ? (
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
        <AuthForm
          mode="signup"
          enableSessionRedirect
          redirectTo="/admin"
          dark
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  )
}
