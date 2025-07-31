"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import GoogleLogin from "./GoogleLogin"
import triggerNextAuthSessionRefresh from "@/lib/triggerNextAuthSessionRefresh"
import { roleRedirectMap } from "@/lib/roleRedirectMap"

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleChange =
    (input: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (input) {
        case "email": {
          setEmail(e.target.value)
          break
        }
        case "password": {
          setPassword(e.target.value)
          break
        }
      }
    }

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    const signInResponse = await signIn("credentials", {
      redirect: false,
      email,
      password
    })

    if (signInResponse?.error === null) {
      // INFO: successful sign in
    } else if (signInResponse?.error === "CredentialsSignin") {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      setError("Unexpected error. Please try again")
      setLoading(false)
    }
  }

  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const router = useRouter()
  useEffect(() => {
    const closePage = Boolean(searchParams.get("close"))
    if (session) {
      if (closePage) {
        triggerNextAuthSessionRefresh()
        window.close()
      } else {
        router.replace(roleRedirectMap[session.user.role])
      }
    }
  }, [session, router])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-6 rounded-3xl bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-7 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Sign In to Dashboard
        </h1>

        {/* Traditional Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange("email")}
              autoComplete="email"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange("password")}
              autoComplete="current-password"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <GoogleLogin />

        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="hidden h-6 w-6 shrink-0 stroke-current md:block"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginForm
