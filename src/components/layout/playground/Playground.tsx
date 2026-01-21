"use client"

import AgentDetails from "./partials/AgentDetails"
import ChatBoxPreview from "./partials/ChatBoxPreview"

interface PlaygroundProps {
  title?: string
  description?: string
}

const Playground = ({ title, description }: PlaygroundProps) => {
  return (
    <div className="flex w-full flex-col justify-between px-5 pt-5">
      <div className="flex w-full flex-col space-y-0.5">
        <h2 className="text-foreground text-2xl font-semibold">
          {title || "Playground"}
        </h2>
        <p className="text-muted-foreground text-base font-medium">
          {description ||
            "Simulate real conversations with your AI agent to verify its functionality and response quality."}
        </p>
      </div>

      <div className="flex h-[calc(100vh-10.5rem)] w-full items-start justify-evenly space-x-5 rounded-t-md bg-zinc-200 bg-[url('/assets/images/bot-settings-playground-bg.png')] bg-cover bg-center px-12 py-5 dark:bg-slate-950">
        <AgentDetails agentName="test" chatBotCode="" agentPrompt="" />

        <ChatBoxPreview agentName="test" chatBotCode="zesty-bee" />
      </div>
    </div>
  )
}

export default Playground
