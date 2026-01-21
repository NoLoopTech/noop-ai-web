"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  useProjectCode,
  useProjectCodeString
} from "@/lib/hooks/useProjectCode"
import { toast } from "@/lib/hooks/useToast"
import { useApiMutation, useApiQuery } from "@/query"
import { IconRefresh } from "@tabler/icons-react"
import { useState } from "react"

enum AgentType {
  DEFAULT = "default",
  CUSTOMER_SUPPORT_AGENT = "customer_support_agent",
  SALES_ASSISTANT = "sales_assistant",
  PRODUCT_GUIDE = "product_guide",
  FINANCE_BUDDY = "finance_buddy",
  TRAVEL_ADVISOR = "travel_advisor",
  CUSTOM_ROLE = "custom_role"
}

type ChangeAgentTypePayload = { chatbotCode: string; newType: AgentType }
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

const AiAgentCard = () => {
  const [agentType, setAgentType] = useState<AgentType | "">("")
  const [confidence, setConfidence] = useState<number>(75)

  const currentProjectId = useProjectCode()
  const chatBotCode = useProjectCodeString()

  const changeAgentTypeMutation = useApiMutation<
    string,
    ChangeAgentTypePayload
  >(`/botsettings/change-agent-type`, "post", {
    onSuccess: (_data, variables) => {
      const newTypeKey = variables?.newType ?? "unknown"
      const option = agentTypeOptions.find(o => o.value === newTypeKey)
      const newTypeLabel = option?.label ?? String(newTypeKey)

      toast({
        title: "Agent type updated",
        description:
          newTypeLabel === "default"
            ? "Agent type Reset successful."
            : `Agent type changed to ${newTypeLabel} successfully.`,
        variant: "success"
      })
    },
    onError: () => {
      toast({ title: "Failed to update agent type", variant: "destructive" })
    }
  })

  const changeAgentConfidenceMutation = useApiMutation<
    string,
    ChangeAgentConfidencePayload
  >(`/botsettings/change-agent-confidence`, "post", {
    onSuccess: (_data, variables) => {
      const newConfidenceLevel = variables?.newConfidenceLevel ?? "unknown"
      toast({
        title: "Confidence threshold updated",
        description: `Confidence threshold changed to ${newConfidenceLevel} successfully.`,
        variant: "success"
      })
    },
    onError: () => {
      toast({
        title: "Failed to update confidence threshold",
        variant: "destructive"
      })
    }
  })

  const { data: agentPromptData } = useApiQuery<{ agentPrompt: string }>(
    ["botsettings-agent-prompt", currentProjectId],
    `botsettings/${currentProjectId}/agent-prompt`,
    () => ({ method: "get" })
  )

  const agentPrompt = agentPromptData?.agentPrompt ?? ""

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
      toast({ title: "Unable to change agent type", variant: "destructive" })
    }
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
      toast({ title: "Unable to reset agent type", variant: "destructive" })
    }

    setAgentType("")
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
      toast({
        title: "Unable to change confidence threshold",
        variant: "destructive"
      })
    }
  }

  const handleSliderValueChange = (values: number[]): void => {
    setConfidence(values[0])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Strategy</CardTitle>
        <CardDescription>
          Define bot tone how the bot should approach responses, from concise to
          conversational
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <div className="mt-3 w-full">
          <p className="text-foreground mb-1.5 text-sm font-medium">
            Agent type
          </p>

          <div className="flex w-full items-center space-x-2">
            <Select value={agentType} onValueChange={handleChangeAgentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-foreground text-sm font-medium">
                    -- Agent Type --
                  </SelectLabel>

                  {agentTypeOptions.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-foreground text-sm font-normal"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="button"
              className="size-[35px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={resetAgentType}
            >
              <IconRefresh className="size-5 stroke-zinc-600 dark:stroke-slate-400" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-foreground mb-1.5 text-sm font-medium">
              Instructions
            </p>
          </div>

          <Textarea
            placeholder="### Role
- Primary Function: You are an AI chatbot who helps users with their inquiries, issues and requests. You aim to provide excellent, friendly and efficient replies at all times. Your role is to listen attentively to the user, understand their needs,"
            value={agentPrompt}
            className="h-80 resize-none text-zinc-500"
            readOnly
          />
        </div>

        <div className="mt-3 w-full pb-2.5">
          <div className="flex w-full items-center justify-between">
            <p className="text-foreground mb-1.5 text-sm font-medium">
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
              trackClassName="data-[orientation=horizontal]:h-2.5"
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
      </CardContent>
    </Card>
  )
}

export default AiAgentCard
