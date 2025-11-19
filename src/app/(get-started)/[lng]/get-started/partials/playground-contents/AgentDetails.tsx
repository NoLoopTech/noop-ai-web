"use client"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group"
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

const AgentDetails = () => {
  const [agentType, setAgentType] = useState<string>("")
  const [toneType, setToneType] = useState<string>("")

  return (
    <div className="h-full min-w-80 rounded-[10px] bg-white py-2.5 pr-2 pl-2.5 shadow-md">
      <h2 className="pl-1 text-lg font-semibold text-zinc-950">
        Agent Details
      </h2>

      <ScrollArea
        className="mt-2 flex h-[calc(100vh-18.3rem)] w-full pr-2.5"
        scrollbarVariant="tiny"
      >
        <div className="flex flex-col items-center space-y-4 p-1">
          <InputGroup className="flex h-9 items-center justify-between rounded-md px-2">
            <InputGroupAddon className="p-0 text-sm font-medium text-zinc-950">
              Agent name:
            </InputGroupAddon>

            <InputGroupInput className="text-right text-sm font-normal text-zinc-500" />
          </InputGroup>

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
              <Select value={agentType} onValueChange={setAgentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium text-zinc-950">
                      Agent Type
                    </SelectLabel>
                    <SelectItem
                      value="customerSupportAgent"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Customer Support Agent
                    </SelectItem>
                    <SelectItem
                      value="salesAssistant"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Sales Assistant
                    </SelectItem>
                    <SelectItem
                      value="productGuide"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Product Guide
                    </SelectItem>
                    <SelectItem
                      value="financeBuddy"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Finance Buddy
                    </SelectItem>
                    <SelectItem
                      value="travelAdvisor"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Travel Advisor
                    </SelectItem>
                    <SelectItem
                      value="customRole"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Custom Role
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="size-[35px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                onClick={() => setAgentType("")}
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
              <Select value={toneType} onValueChange={setToneType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium text-zinc-950">
                      Tone Type
                    </SelectLabel>
                    <SelectItem
                      value="friendly"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Friendly
                    </SelectItem>
                    <SelectItem
                      value="formal"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Formal
                    </SelectItem>
                    <SelectItem
                      value="playful"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Playful
                    </SelectItem>
                    <SelectItem
                      value="detailed"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Detailed
                    </SelectItem>
                    <SelectItem
                      value="empathetic"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Empathetic
                    </SelectItem>
                    <SelectItem
                      value="neutral"
                      className="text-sm font-normal text-zinc-950"
                    >
                      Neutral
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="size-[35px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                onClick={() => setToneType("")}
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

              <p className="text-xs font-normal text-zinc-500">0.75</p>
            </div>

            <div className="flex w-full items-center space-x-2">
              <Slider defaultValue={[50]} max={100} className="my-1" step={1} />
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
              className="h-32 resize-none"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AgentDetails
