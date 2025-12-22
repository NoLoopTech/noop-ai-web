"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useApiMutation } from "@/query"

type ClaimAgentRequest = { chatBotCode: string }
type ClaimAgentResponse = {
  success: boolean
  projectId: number
  agentId: number | null
  message: string
}

export const ONBOARDING_CHATBOT_CODE_KEY = "onboarding:chatBotCode"

export default function useClaimAgentAfterAuth() {
  const { status, data: session } = useSession()
  const ranRef = useRef(false)

  const claimAgentMutation = useApiMutation<
    ClaimAgentResponse,
    ClaimAgentRequest
  >("/onboarding/claim-agent", "post", {
    onSettled: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(ONBOARDING_CHATBOT_CODE_KEY)
      }
    }
  })

  useEffect(() => {
    if (ranRef.current) return
    if (status !== "authenticated") return

    if (!session?.apiToken) return

    if (typeof window === "undefined") return
    const code = sessionStorage.getItem(ONBOARDING_CHATBOT_CODE_KEY)
    if (!code) return

    ranRef.current = true
    claimAgentMutation.mutate({ chatBotCode: code })
  }, [status, session?.apiToken, claimAgentMutation])
}
