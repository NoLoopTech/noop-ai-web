"use client"

import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import React, { useEffect, useState } from "react"

const VerifyEmail = ({ code }: { code: string }) => {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      redirect("/admin")
    }
  }, [session])

  const verifyCode = async (): Promise<void> => {
    const signInResponse = await signIn("emailverify", {
      callbackUrl: "/admin",
      redirect: false,
      code
    })

    if (!signInResponse?.ok) {
      setError("Invalid link or link has expired")
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
