"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { IconRefresh } from "@tabler/icons-react"
import { useState } from "react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { useApiMutation } from "@/query/hooks/useApiMutation"
import { toast } from "@/lib/hooks/useToast"
import { getBotBehaviorDescription } from "@/utils"
import { AgentType, ToneType } from "@/types/botBehavior"

type ChangeAgentTypePayload = { chatbotCode: string; newType: AgentType }
type ChangeAgentTonePayload = { chatbotCode: string; newTone: ToneType }
type ChangeAgentConfidencePayload = {
  chatbotCode: string
  newConfidenceLevel: string
}

const agentTypeOptions = [
  { value: AgentType.CUSTOMER_SUPPORT_AGENT, label: "Customer Support Agent" },
  { value: AgentType.SALES_ASSISTANT, label: "Sales Assistant" },
  { value: AgentType.PRODUCT_GUIDE, label: "Product Guide" },
  { value: AgentType.FINANCE_BUDDY, label: "Finance Buddy" },
  { value: AgentType.TRAVEL_ADVISOR, label: "Travel Advisor" },
  { value: AgentType.CUSTOM_ROLE, label: "Custom Role" }
]

const toneTypeOptions = [
  { value: ToneType.FRIENDLY, label: "Friendly" },
  { value: ToneType.FORMAL, label: "Formal" },
  { value: ToneType.PLAYFUL, label: "Playful" },
  { value: ToneType.DETAILED, label: "Detailed" },
  { value: ToneType.EMPATHETIC, label: "Empathetic" },
  { value: ToneType.NEUTRAL, label: "Neutral" }
]

const AgentDetails = () => {
  const [agentType, setAgentType] = useState<AgentType | "">("")
  const [toneType, setToneType] = useState<ToneType | "">("")
  const [confidence, setConfidence] = useState<number>(75)

  const { chatBotCode, agentName, agentPrompt } = useOnboardingStore()

  const changeAgentTypeMutation = useApiMutation<
    string,
    ChangeAgentTypePayload
  >("/onboarding/change-agent-type", "post", {
    onSuccess: data => {
      toast({
        title: "Agent type updated",
        description: getBotBehaviorDescription(data)
      })
    },
    onError: () => {
      toast({ title: "Failed to update agent type" })
    }
  })

  const changeAgentToneMutation = useApiMutation<
    string,
    ChangeAgentTonePayload
  >("/onboarding/change-agent-tone", "post", {
    onSuccess: data => {
      toast({
        title: "Agent tone updated",
        description: getBotBehaviorDescription(data)
      })
    },
    onError: () => {
      toast({ title: "Failed to update agent tone" })
    }
  })

  const changeAgentConfidenceMutation = useApiMutation<
    string,
    ChangeAgentConfidencePayload
  >("/onboarding/change-agent-confidence", "post", {
    onSuccess: data => {
      toast({
        title: "Confidence threshold updated",
        description: getBotBehaviorDescription(data)
      })
    },
    onError: () => {
      toast({ title: "Failed to update confidence threshold" })
    }
  })

  const handleChangeAgentType = (value: AgentType | ""): void => {
    setAgentType(value)
    if (!value) return
    try {
      const payload: ChangeAgentTypePayload = {
        chatbotCode: chatBotCode ?? "",
        newType: value
      }
      changeAgentTypeMutation.mutate(payload)
    } catch (_err) {
      toast({ title: "Unable to change agent type" })
    }
  }

  const handleChangeAgentTone = (value: ToneType | ""): void => {
    setToneType(value)
    if (!value) return
    try {
      const payload: ChangeAgentTonePayload = {
        chatbotCode: chatBotCode ?? "",
        newTone: value
      }
      changeAgentToneMutation.mutate(payload)
    } catch (_err) {
      toast({ title: "Unable to change agent tone" })
    }
  }

  const handleChangeConfidence = (values: number[]): void => {
    setConfidence(values[0])
    try {
      const level = (values[0] / 100).toFixed(2)
      const payload: ChangeAgentConfidencePayload = {
        chatbotCode: chatBotCode ?? "",
        newConfidenceLevel: level
      }
      changeAgentConfidenceMutation.mutate(payload)
    } catch (_err) {
      toast({ title: "Unable to change confidence threshold" })
    }
  }

  const handleSliderValueChange = (values: number[]): void => {
    setConfidence(values[0])
  }

  const resetAgentType = (): void => {
    const value: AgentType = AgentType.DEFAULT
    setAgentType(value)
    try {
      const payload: ChangeAgentTypePayload = {
        chatbotCode: chatBotCode ?? "",
        newType: value
      }
      changeAgentTypeMutation.mutate(payload)
    } catch (_err) {
      toast({ title: "Unable to reset agent type" })
    }

    setAgentType("")
  }

  const resetToneType = (): void => {
    const value: ToneType = ToneType.DEFAULT
    setToneType(value)
    try {
      const payload: ChangeAgentTonePayload = {
        chatbotCode: chatBotCode ?? "",
        newTone: value
      }
      changeAgentToneMutation.mutate(payload)
    } catch (_err) {
      toast({ title: "Unable to reset agent tone" })
    }

    setToneType("")
  }

  return (
    <div className="flex h-full min-w-80 flex-col space-y-2.5 rounded-[10px] bg-white py-2.5 pr-2 pl-2.5 shadow-md">
      <h2 className="pl-1 text-lg font-semibold text-zinc-950">
        Agent Details
      </h2>

      <ScrollArea className="flex h-full w-full pr-2.5" scrollbarVariant="tiny">
        <div className="flex flex-col items-center space-y-4 p-1">
          <div className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 px-2">
            <p className="text-sm font-medium text-zinc-950">Agent name:</p>

            <p className="text-right text-sm font-normal text-zinc-500">
              {agentName ?? "—"}
            </p>
          </div>

          <div className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 px-2">
            <p className="text-sm font-medium text-zinc-950">Agent status:</p>

            <p className="text-sm text-[#34c759]">Trained</p>
          </div>

          <Separator className="my-1 w-full" />

          <div className="mt-3 w-full">
            <p className="mb-1.5 text-sm font-medium text-zinc-950">
              Agent type
            </p>

            <div className="flex w-full items-center space-x-2">
              <Select value={agentType} onValueChange={handleChangeAgentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium text-zinc-950">
                      Agent Type
                    </SelectLabel>

                    {agentTypeOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-sm font-normal text-zinc-950"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="size-[35px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                onClick={resetAgentType}
              >
                <IconRefresh className="size-5 stroke-zinc-600" />
              </Button>
            </div>
          </div>

          <Separator className="my-1 w-full" />

          <div className="mt-3 w-full">
            <p className="mb-1.5 text-sm font-medium text-zinc-950">
              Bot Tone type
            </p>

            <div className="flex w-full items-center space-x-2">
              <Select value={toneType} onValueChange={handleChangeAgentTone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium text-zinc-950">
                      Tone Type
                    </SelectLabel>

                    {toneTypeOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-sm font-normal text-zinc-950"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="size-[35px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                onClick={resetToneType}
              >
                <IconRefresh className="size-5 stroke-zinc-600" />
              </Button>
            </div>
          </div>

          <Separator className="my-1 w-full" />

          <div className="mt-3 w-full">
            <div className="flex w-full items-center justify-between">
              <p className="mb-1.5 text-sm font-medium text-zinc-950">
                Confidence Threshold
              </p>

              <p className="text-xs font-normal text-zinc-500">
                {(confidence / 100).toFixed(2)}
              </p>
            </div>

            <div className="flex w-full items-center space-x-2">
              <Slider
                value={[confidence]}
                max={100}
                className="my-1"
                trackClassName="data-[orientation=horizontal]:h-2"
                step={1}
                onValueChange={handleSliderValueChange}
                onValueCommit={handleChangeConfidence}
              />
            </div>

            <div className="mt-1 flex w-full items-center justify-between">
              <p className="text-xs font-normal text-zinc-500">Restrictive</p>

              <p className="text-xs font-normal text-zinc-500">Accurate</p>
            </div>
          </div>

          <Separator className="w-full" />

          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <p className="mb-1.5 text-sm font-medium text-zinc-950">
                Instructions
              </p>
            </div>

            <Textarea
              placeholder="### Role
- Primary Function: You are an AI chatbot who helps users with their inquiries, issues and requests. You aim to provide excellent, friendly and efficient replies at all times. Your role is to listen attentively to the user, understand their needs, "
              className="h-40 resize-none text-zinc-500"
              value={agentPrompt ?? ""}
              readOnly
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AgentDetails
