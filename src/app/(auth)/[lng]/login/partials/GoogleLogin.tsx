"use client"
import { signIn } from "next-auth/react"
import Script from "next/script"
import { useRef, useState } from "react"

export default function GoogleLogin(): React.ReactNode {
  const [loading, setLoading] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const handleGoogleLogin = (
    response: google.accounts.id.CredentialResponse
  ): void => {
    setLoading(true)
    void signIn("googlesignin", {
      redirect: false,
      credential: response.credential
    })
  }
  const handleGoogleSignInLoaded = (): void => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      callback: handleGoogleLogin
    })

    if (googleButtonRef.current !== null) {
      google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with"
      })
    }
  }
  return (
    <div>
      <div className="flex flex-col items-center gap-x-4 pb-4">
        {loading ? (
          <span className="loading loading-dots loading-lg text-black dark:text-slate-200"></span>
        ) : (
          <div id="gsi-container" ref={googleButtonRef}></div>
        )}
      </div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={handleGoogleSignInLoaded}
      />
    </div>
  )
}
