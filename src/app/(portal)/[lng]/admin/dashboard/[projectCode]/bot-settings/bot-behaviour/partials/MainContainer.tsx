"use client"

import { useProjectCodeString } from "@/lib/hooks/useProjectCode"
import { useApiQuery } from "@/query"
import { getBotBehaviorResponse } from "@/types/botBehavior"
import ResponseStrategyCard from "./ResponseStrategyCard"
import AiAgentCard from "./AiAgentCard"

const MainContainer = () => {
  const chatbotCode = useProjectCodeString()

  const { data: botBehaviorData, isLoading: isBotBehaviorLoading } =
    useApiQuery<getBotBehaviorResponse>(
      ["botsettings-playground-bot-behavior", chatbotCode],
      `botsettings/${chatbotCode}/bot-behavior`,
      () => ({ method: "get" })
    )

  return (
    <div className="mx-auto mb-4 flex max-w-4xl flex-col space-y-7">
      <ResponseStrategyCard
        isBotBehaviorLoading={isBotBehaviorLoading}
        botBehaviorData={botBehaviorData}
      />

      <AiAgentCard
        isBotBehaviorLoading={isBotBehaviorLoading}
        botBehaviorData={botBehaviorData}
      />
    </div>
  )
}

export default MainContainer
