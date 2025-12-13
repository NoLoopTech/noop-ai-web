"use client"

import React, { useEffect, useRef, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
  confirmPassword: z.string().optional()
})

const internalFormSchema = formSchema
  .extend({
    mode: z.enum(["signin", "signup"])
  })
  .superRefine((data, ctx) => {
    if (data.mode !== "signup") return

    if (!data.confirmPassword || data.confirmPassword.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Please confirm your password"
      })
      return
    }

    if (data.confirmPassword !== data.password) {
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
  onSignUp?: (values: z.infer<typeof formSchema>) => Promise<void>
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string
  enableSessionRedirect?: boolean
  showGoogle?: boolean
  dark?: boolean

  googleLoginProps?: Omit<GoogleLoginProps, "type" | "callbackUrl">
}

type InternalFormValues = z.infer<typeof internalFormSchema>

const AuthForm: React.FC<AuthFormProps> = ({
  mode = "signin",
  onSignUp,
  onSuccess,
  onError,
  redirectTo,
  enableSessionRedirect = false,
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
    defaultValues: { mode, email: "", password: "", confirmPassword: "" }
  })

  useEffect(() => {
    setActiveMode(mode)
    form.setValue("mode", mode, { shouldValidate: true })
  }, [mode, form])

  const toggleMode = () => {
    const nextMode: AuthMode = activeMode === "signin" ? "signup" : "signin"
    setActiveMode(nextMode)
    form.reset({ mode: nextMode, email: "", password: "", confirmPassword: "" })
  }

  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const router = useRouter()

  const didRedirectRef = useRef(false)

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
    if (target) {
      didRedirectRef.current = true
      router.replace(target)
    }
  }, [enableSessionRedirect, session, router, searchParams, redirectTo])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return
    setLoading(true)

    if (!isSignIn) {
      if (!values.confirmPassword) {
        form.setError("confirmPassword", {
          type: "manual",
          message: "Please confirm your password"
        })
        setLoading(false)
        return
      }
      if (values.confirmPassword !== values.password) {
        form.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match"
        })
        setLoading(false)
        return
      }
    }

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
        if (!onSignUp) throw new Error("Sign-up handler not provided")
        await onSignUp(values)
      }

      toast({
        title: isSignIn ? "Sign In Successful" : "Sign Up Successful",
        description: isSignIn
          ? "You have been signed in successfully"
          : "Your account has been created",
        variant: "success"
      })

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
      <div className="relative flex h-full min-w-1/2 flex-col">
        <div className="relative flex-1 overflow-hidden rounded-lg">
          <Image
            src={isSignIn ? signInImage : signUpImage}
            alt="Register Page Background"
            fill
            className="object-cover object-left-top"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[29%] to-black/50 to-[100%]" />
        </div>

        <div className="absolute top-8 left-9 z-10">
          <Image
            src="/assets/noopy-white-full.png"
            alt="Noopy Logo"
            width={168}
            height={37}
          />
        </div>

        <div className="absolute inset-x-0 bottom-10 h-max w-full bg-transparent px-7">
          <h1
            className={`w-full text-left text-5xl font-medium drop-shadow-black/25 ${dark ? "text-foreground" : "text-white"} drop-shadow-md`}
          >
            Your Gateway to Smarter Conversations
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex h-full w-full min-w-1/2 flex-col items-center justify-center">
        <div className="w-lg">
          <div className="flex w-full flex-col items-center justify-start space-y-2 py-10 text-left">
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
                    <div className="grid gap-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
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

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
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
                            <FormItem className="space-y-1">
                              <FormLabel>Confirm Password</FormLabel>
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

                      <Button className="mt-2" disabled={loading}>
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

          <div className="mt-8 flex w-full flex-col items-center space-y-5 text-center text-sm text-[#7E7E7E]">
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

              <button
                type="button"
                onClick={toggleMode}
                className="underline hover:no-underline"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
