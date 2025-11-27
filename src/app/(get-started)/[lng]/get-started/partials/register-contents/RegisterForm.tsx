"use client"

import { signIn } from "next-auth/react"
// import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// import triggerNextAuthSessionRefresh from "@/lib/triggerNextAuthSessionRefresh"
// import { roleRedirectMap } from "@/lib/roleRedirectMap"
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
// import { Button } from "@/components/ui/button"
// import { IconLoader } from "@tabler/icons-react"
import { toast } from "@/lib/hooks/useToast"
import GoogleRegister from "./GoogleRegister"

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" })
})

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    if (loading) return

    setLoading(true)

    const signInResponse = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password
    })

    if (signInResponse?.error === null) {
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
        variant: "success"
      })
    } else if (signInResponse?.error === "CredentialsSignin") {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      })
      setLoading(false)
    } else {
      toast({
        title: "Login Failed",
        description: "Unexpected error. Please try again",
        variant: "destructive"
      })
      setLoading(false)
    }

    setLoading(false)
  }

  // const searchParams = useSearchParams()
  // const { data: session } = useSession()
  // const router = useRouter()

  // INFO: Uncomment this block to enable automatic redirection after login
  // useEffect(() => {
  //   const closePage = Boolean(searchParams.get("close"))
  //   if (session) {
  //     if (closePage) {
  //       triggerNextAuthSessionRefresh()
  //       window.close()
  //     } else {
  //       router.replace(roleRedirectMap[session.user.role])
  //     }
  //   }
  // }, [session, router, searchParams])

  // TODO: this is just a copy of the login form from the auth page. need to refactor later.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-transparent">
        <div className="flex items-center justify-center">
          <GoogleRegister />
        </div>

        <div className="relative mt-2.5 mb-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
                      {/* <Link
                        href="/forgot-password"
                        className="text-muted-foreground text-sm font-medium hover:opacity-75"
                      >
                        Forgot password?
                      </Link> */}
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Button className="mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <IconLoader className="h-4 w-4 animate-spin duration-[1500ms] ease-in-out" />{" "}
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button> */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RegisterForm
