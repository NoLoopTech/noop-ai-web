"use client"

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
import { useProjectCodeString } from "@/lib/hooks/useProjectCode"
import { toast } from "@/lib/hooks/useToast"
import { useApiMutation } from "@/query"
import { getBotBehaviorResponse, ToneType } from "@/types/botBehavior"
import { useEffect, useMemo, useState } from "react"

type ChangeAgentTonePayload = { chatbotCode: string; newTone: ToneType }

const toneTypeOptions = [
  {
    value: ToneType.FRIENDLY,
    label: "Friendly",
    description:
      "Noopy.ai is your friendly AI assistant, designed to welcome visitors and guide them naturally through your website. It answers questions, offers help, and keeps conversations warm and approachable — like chatting with a helpful teammate.",
    preview:
      "Tone: Hey there!  I’m here to help. Let me know what you’re looking for, and I’ll guide you through it."
  },
  {
    value: ToneType.FORMAL,
    label: "Formal",
    description:
      "Noopy.ai is a professional AI assistant built to communicate clearly and respectfully with your website visitors. It provides accurate information, structured responses, and maintains a polished, business-ready tone at all times.",
    preview:
      "Tone: Welcome. I’m here to assist you. Please let me know how I can help you today."
  },
  {
    value: ToneType.PLAYFUL,
    label: "Playful",
    description:
      "Noopy.ai is a lively AI assistant that engages visitors with a fun and energetic style. It answers questions, adds light humor, and keeps conversations enjoyable — making interactions feel relaxed and memorable.",
    preview:
      "Tone: Hi!  Got a question or just exploring? I’m ready when you are!"
  },
  {
    value: ToneType.DETAILED,
    label: "Detailed",
    description:
      "Noopy.ai is a thorough AI assistant designed to give in-depth explanations and clear guidance. It walks visitors through answers step by step, ensuring nothing is missed and every detail is well explained.",
    preview:
      "Tone: Hello! I can walk you through everything step by step. Just tell me what you’d like to know, and we’ll go through it together."
  },
  {
    value: ToneType.EMPATHETIC,
    label: "Empathetic",
    description:
      "Noopy.ai is a caring AI assistant that understands user concerns and responds with empathy. It listens carefully, reassures visitors, and provides supportive, thoughtful answers — especially in sensitive situations.",
    preview:
      "Tone: Hi, I’m here to help. If something isn’t working as expected, let’s take a look and sort it out together."
  },
  {
    value: ToneType.NEUTRAL,
    label: "Neutral",
    description:
      "Noopy.ai is a balanced AI assistant that communicates clearly and objectively. It delivers concise, factual responses without added emotion, keeping conversations straightforward and easy to follow.",
    preview: "Tone: Hello. How can I assist you today?"
  }
]

interface ResponseStrategyCardProps {
  isBotBehaviorLoading: boolean
  botBehaviorData: getBotBehaviorResponse | undefined
}

const ResponseStrategyCard = ({
  isBotBehaviorLoading,
  botBehaviorData
}: ResponseStrategyCardProps) => {
  const [toneType, setToneType] = useState<ToneType | "">("")

  useEffect(() => {
    if (botBehaviorData) {
      setToneType(
        botBehaviorData.toneType === ToneType.DEFAULT
          ? ""
          : (botBehaviorData.toneType ?? "")
      )
    }
  }, [botBehaviorData])

  const selectedTone = useMemo(
    () => toneTypeOptions.find(option => option.value === toneType),
    [toneType]
  )

  const chatBotCode = useProjectCodeString()

  const changeAgentToneMutation = useApiMutation<
    string,
    ChangeAgentTonePayload
  >(`/botsettings/change-agent-tone`, "post", {
    onSuccess: (_data, variables) => {
      const newToneKey = variables?.newTone ?? "unknown"
      const option = toneTypeOptions.find(o => o.value === newToneKey)
      const newToneLabel = option?.label ?? String(newToneKey)

      toast({
        title: "Agent tone updated",
        description: `Agent tone changed to ${newToneLabel} successfully.`,
        variant: "success"
      })
    },
    onError: () => {
      toast({ title: "Failed to update agent tone", variant: "destructive" })
    }
  })

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
      toast({ title: "Unable to change agent tone", variant: "destructive" })
    }
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
      <CardContent className="w-full space-y-10">
        <div className="mt-1 w-full">
          <p className="text-foreground mb-2 text-sm font-medium">
            Bot Tone type
          </p>

          <div className="flex w-full items-center space-x-2">
            {isBotBehaviorLoading ? (
              <div className="shine h-9 w-full rounded-md"></div>
            ) : (
              <Select value={toneType} onValueChange={handleChangeAgentTone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-foreground text-sm font-medium">
                      -- Tone Type --
                    </SelectLabel>

                    {toneTypeOptions.map(option => (
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
            )}
          </div>
        </div>

        {selectedTone && (selectedTone.value !== ToneType.DEFAULT || "") && (
          <div className="mt-1 w-full">
            <p className="text-foreground mb-2 text-sm font-medium">
              Tone Preview
            </p>

            <div className="flex w-full flex-col items-start space-y-5 rounded-xl border border-zinc-200 p-4 text-left dark:border-slate-800">
              <p className="text-sm font-medium text-zinc-500">
                {selectedTone.description}
              </p>

              <p className="text-foreground text-sm font-semibold">
                {selectedTone.preview}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ResponseStrategyCard
