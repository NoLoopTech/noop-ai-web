"use client"

import React, { useEffect, useRef, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader } from "@tabler/icons-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/PasswordInput"
import { Button } from "@/components/ui/button"
import GoogleLogin, {
  type GoogleLoginProps
} from "@/components/layout/auth/GoogleLogin"
import { toast } from "@/lib/hooks/useToast"
import triggerNextAuthSessionRefresh from "@/lib/triggerNextAuthSessionRefresh"
import { roleRedirectMap } from "@/lib/roleRedirectMap"
import Image from "next/image"
import { registerEmail } from "@/services/authService"

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
  fullName: z.string().optional(),
  confirmPassword: z.string().optional()
})

const internalFormSchema = formSchema
  .extend({
    mode: z.enum(["signin", "signup"])
  })
  .superRefine((data, ctx) => {
    if (data.mode !== "signup") return

    if (!data.fullName || data.fullName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fullName"],
        message: "Please enter your full name"
      })
    }

    if (!data.confirmPassword || data.confirmPassword.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Please confirm your password"
      })
    } else if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match"
      })
    }
  })

type AuthMode = "signin" | "signup"

type AuthFormProps = {
  mode?: AuthMode
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string
  enableSessionRedirect?: boolean
  switchModeRoutes?: Partial<Record<AuthMode, string>>
  showGoogle?: boolean
  dark?: boolean

  googleLoginProps?: Omit<GoogleLoginProps, "type" | "callbackUrl">
}

type InternalFormValues = z.infer<typeof internalFormSchema>

const AuthForm: React.FC<AuthFormProps> = ({
  mode = "signin",
  onSuccess,
  onError,
  redirectTo,
  enableSessionRedirect = false,
  switchModeRoutes,
  showGoogle = true,
  dark = false,
  googleLoginProps
}) => {
  const [activeMode, setActiveMode] = useState<AuthMode>(mode)
  const isSignIn = activeMode === "signin"
  const [loading, setLoading] = useState(false)

  const form = useForm<InternalFormValues>({
    resolver: zodResolver(internalFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      mode,
      email: "",
      fullName: "",
      password: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    setActiveMode(mode)
    form.setValue("mode", mode, { shouldValidate: true })
  }, [mode, form])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  const toggleMode = () => {
    const nextMode: AuthMode = activeMode === "signin" ? "signup" : "signin"

    const targetRoute = switchModeRoutes?.[nextMode]
    if (targetRoute) {
      router.replace(targetRoute)
      return
    }

    setActiveMode(nextMode)
    form.reset({
      mode: nextMode,
      email: "",
      fullName: "",
      password: "",
      confirmPassword: ""
    })
  }

  const didRedirectRef = useRef(false)

  const normalizePath = (p: string) => {
    if (!p) return "/"
    const trimmed = p.length > 1 ? p.replace(/\/+$/, "") : p
    return trimmed || "/"
  }

  useEffect(() => {
    if (didRedirectRef.current) return
    if (!enableSessionRedirect || !session) return

    const closePage = Boolean(searchParams.get("close"))
    if (closePage) {
      didRedirectRef.current = true
      triggerNextAuthSessionRefresh()
      window.close()
      return
    }

    const target = redirectTo ?? roleRedirectMap[session.user.role]
    if (!target) return

    try {
      const currentUrl = new URL(window.location.href)
      const targetUrl = new URL(target, window.location.origin)

      const samePath =
        normalizePath(currentUrl.pathname) === normalizePath(targetUrl.pathname)
      const sameQuery = currentUrl.search === targetUrl.search

      if (samePath && sameQuery) {
        didRedirectRef.current = true
        return
      }
    } catch {}

    didRedirectRef.current = true
    router.replace(target)
  }, [
    enableSessionRedirect,
    session,
    router,
    searchParams,
    redirectTo,
    pathname
  ])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return
    setLoading(true)

    try {
      if (isSignIn) {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password
        })

        if (res?.error) {
          const msg =
            res.error === "CredentialsSignin"
              ? "Invalid email or password"
              : "Unexpected error. Please try again"
          throw new Error(msg)
        }
      } else {
        const fullName = values.fullName ?? ""
        const res = await registerEmail(fullName, values.email, values.password)

        if (!res.ok) {
          let msg = `Registration failed (status ${res.status})`

          if (
            res.body &&
            typeof res.body === "object" &&
            "message" in res.body
          ) {
            const b = res.body as Record<string, unknown>

            if (typeof b.message === "string") {
              msg = b.message
            } else if (Array.isArray(b.message)) {
              msg = (b.message as string[]).join("; ")
            }
          }

          toast({
            title: "Sign Up Failed",
            description: msg,
            variant: "destructive"
          })

          onError?.(msg)
          return
        }
      }

      toast({
        title: isSignIn ? "Sign In Successful" : "Sign Up Successful",
        description: isSignIn
          ? "You have been signed in successfully"
          : "Your account has been created",
        variant: "success"
      })

      if (!isSignIn && onSuccess) {
        onSuccess()
        return
      }

      if (redirectTo && !enableSessionRedirect) {
        didRedirectRef.current = true
        router.replace(redirectTo)
      }

      onSuccess?.()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected error. Please try again"

      toast({
        title: isSignIn ? "Sign In Failed" : "Sign Up Failed",
        description: message,
        variant: "destructive"
      })

      onError?.(message)
    } finally {
      setLoading(false)
    }
  }

  const signInImage = "/assets/images/auth-form-signin-image.jpg"
  const signUpImage = "/assets/images/auth-form-signup-image.jpg"

  return (
    <div className="flex h-full w-full items-center justify-between">
      {/* Left side */}
      <div className="relative flex h-full w-full min-w-1/2 flex-col">
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={isSignIn ? signInImage : signUpImage}
            alt="Register Page Background"
            fill
            className="object-cover object-left-top"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[29%] to-black/50 to-[100%]" />
        </div>

        <div className="absolute top-8 left-10 z-10">
          <Image
            src="/assets/noopy-white-full.png"
            alt="Noopy Logo"
            width={168}
            height={37}
          />
        </div>

        <div className="absolute inset-x-0 bottom-10 h-max w-full bg-transparent px-10">
          <h1
            className={`w-full max-w-2xl text-left text-5xl font-medium text-white drop-shadow-md drop-shadow-black/25`}
          >
            Your Gateway to Smarter Conversations
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex h-full w-full max-w-2xl min-w-lg flex-col items-center justify-center px-5 2xl:max-w-6/12">
        <div className="w-full">
          <div className="flex w-full flex-col items-center justify-start space-y-1.5 pb-7 text-left">
            <h2
              className={`text-2xl font-semibold ${dark ? "text-foreground" : "text-zinc-950"}`}
            >
              {isSignIn ? "Welcome Back" : "Let's get started"}
            </h2>

            <p className="text-base text-zinc-500">
              {isSignIn
                ? "Access your account securely."
                : "Securely create your account in seconds."}
            </p>
          </div>

          <div className="w-full">
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6 rounded-3xl bg-transparent">
              <div className="w-full max-w-md">
                {showGoogle && (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <GoogleLogin
                        type={isSignIn ? "signin" : "signup"}
                        callbackUrl={redirectTo ?? "/admin/"}
                        {...googleLoginProps}
                      />
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>

                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-4">
                          Or
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid gap-5 overflow-hidden">
                      {!isSignIn && (
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5 px-0.5">
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5 px-0.5">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="name@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div
                        className={`flex w-full ${!isSignIn ? "mt-1 items-start space-x-2.5" : ""}`}
                      >
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="w-full space-y-1.5 px-0.5">
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                              </div>
                              <FormControl>
                                <PasswordInput
                                  placeholder="Password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {!isSignIn && (
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="w-full space-y-1.5 px-0.5">
                                <div className="flex items-center justify-between">
                                  <FormLabel>Confirm Password</FormLabel>
                                </div>
                                <FormControl>
                                  <PasswordInput
                                    placeholder="Confirm password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="mt-2 bg-[#093AD7] text-white transition-colors duration-500 ease-in-out hover:bg-[#093AD7]/75"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <IconLoader className="h-4 w-4 animate-spin duration-[1500ms] ease-in-out" />{" "}
                            <span>
                              {isSignIn ? "Signing in..." : "Signing up..."}
                            </span>
                          </>
                        ) : isSignIn ? (
                          "Sign In"
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          <div className="mt-7 flex w-full flex-col items-center space-y-2 text-center text-sm text-[#7E7E7E]">
            {!isSignIn && (
              <p>
                By sign up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            )}

            <div className="flex items-center space-x-2">
              <p>
                {isSignIn
                  ? "Don’t have an account? "
                  : "Already have an account? "}
              </p>

              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="p-0 text-sm text-zinc-500 underline hover:no-underline"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
