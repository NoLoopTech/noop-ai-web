"use client"

import {
  IconArrowsDiagonal,
  IconArrowUp,
  IconDotsVertical,
  IconX
} from "@tabler/icons-react"
import { Smile } from "lucide-react"
import Image from "next/image"
import { useOnboardingStore } from "../../store/onboarding.store"

const AgentPreview = () => {
  const agentName = useOnboardingStore(s => s.agentName)

  return (
    <div className="relative h-[500px] min-w-[360px] rounded-[10px] bg-white shadow-md">
      <div className="flex h-14 w-full items-center justify-between rounded-t-md border-b border-zinc-300 bg-zinc-100">
        <div className="flex h-full items-center space-x-2.5 px-4 py-3">
          <h2 className="flex size-7 items-center justify-center rounded-full bg-zinc-500 text-lg font-semibold text-white">
            N
          </h2>

          <h2 className="text-xl font-semibold text-zinc-950">
            {agentName ?? "—"}
          </h2>
        </div>

        <div className="flex items-center space-x-3 pr-3">
          <IconArrowsDiagonal className="size-5 stroke-zinc-600" />
          <IconX className="size-5 stroke-zinc-600" />
          <IconDotsVertical className="size-5 stroke-zinc-600" />
        </div>
      </div>

      <div className="flex flex-col space-y-4 p-3">
        <p className="max-w-4/6 self-start rounded-xl bg-zinc-100 px-3 py-2.5 text-xs">
          Hi! What can I help you with? 👋
        </p>

        <p className="max-w-4/6 self-end rounded-full bg-black px-3 py-2.5 text-xs text-white">
          What can you do?
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-2 mx-3 flex h-max flex-col items-center">
        <div
          className={`h-full w-full transition-all duration-300 ease-in-out`}
        >
          <div className="flex h-20 w-full flex-col justify-between rounded-3xl border-2 border-zinc-200 bg-white px-3 pt-2.5 pb-1.5">
            <p className="w-full text-xs wrap-anywhere text-zinc-900">
              How do I register to Noopy
            </p>
            <div className="flex items-center justify-between">
              <Smile className="h-3.5 w-3.5 text-zinc-500" />
              <div className="rounded-full bg-black p-1">
                <IconArrowUp className="h-3.5 w-3.5 text-zinc-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center space-x-1 text-[10px] font-medium text-zinc-500">
          <p>Powered by </p>
          <Image
            src="/assets/noopy-blue-full.png"
            alt="Noopy.ai Logo"
            width={60}
            height={10}
          />
        </div>
      </div>
    </div>
  )
}

export default AgentPreview
