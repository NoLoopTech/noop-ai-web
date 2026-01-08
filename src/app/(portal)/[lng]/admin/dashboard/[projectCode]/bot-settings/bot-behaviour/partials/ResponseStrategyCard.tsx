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
import { useProjectCode } from "@/lib/hooks/useProjectCode"
import { toast } from "@/lib/hooks/useToast"
import { UserProject } from "@/models/project"
import { useApiMutation, useApiQuery } from "@/query"
import { useMemo, useState } from "react"

enum ToneType {
  DEFAULT = "default",
  FRIENDLY = "friendly",
  FORMAL = "formal",
  PLAYFUL = "playful",
  DETAILED = "detailed",
  EMPATHETIC = "empathetic",
  NEUTRAL = "neutral"
}

type ChangeAgentTonePayload = { chatbotCode: string; newTone: ToneType }

const toneTypeOptions = [
  { value: ToneType.FRIENDLY, label: "Friendly" },
  { value: ToneType.FORMAL, label: "Formal" },
  { value: ToneType.PLAYFUL, label: "Playful" },
  { value: ToneType.DETAILED, label: "Detailed" },
  { value: ToneType.EMPATHETIC, label: "Empathetic" },
  { value: ToneType.NEUTRAL, label: "Neutral" }
]

const ResponseStrategyCard = () => {
  const [toneType, setToneType] = useState<ToneType | "">("")

  const currentProjectId = useProjectCode()

  const { data: userProjects } = useApiQuery<UserProject[]>(
    ["user-projects-bot-settings"],
    `user/me/projects`,
    () => ({ method: "get" })
  )

  const chatBotCode = useMemo(
    () =>
      (userProjects ?? []).find(p => p.id === currentProjectId)?.chatbotCode ??
      "",
    [userProjects, currentProjectId]
  )

  const changeAgentToneMutation = useApiMutation<
    string,
    ChangeAgentTonePayload
  >(`/botsettings/${currentProjectId}/change-agent-tone`, "post", {
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
          </div>
        </div>

        <div className="mt-1 w-full">
          <p className="text-foreground mb-2 text-sm font-medium">
            Tone Preview
          </p>

          <div className="flex w-full items-center space-x-2 rounded-xl border border-zinc-200 p-4 dark:border-slate-800">
            <p className="text-sm font-medium text-zinc-500">
              Noopy.ai is your personal AI assistant, built to interact with
              visitors on your website just like a real team member would. It
              can answer questions, assist with tasks, and offer helpful
              suggestions — all in real time!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResponseStrategyCard
