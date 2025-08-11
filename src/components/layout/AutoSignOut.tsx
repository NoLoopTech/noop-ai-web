"use client"

import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

const AutoSignOut: React.FC = () => {
  const { data: session, update } = useSession()
  useEffect(() => {
    if (session === null) {
      // eslint-disable-next-line no-console
      console.log("Auto sign out intiated")
      void signOut({
        callbackUrl: "/login"
      })
    }
  }, [session, update])
  return null
}

export default AutoSignOut
