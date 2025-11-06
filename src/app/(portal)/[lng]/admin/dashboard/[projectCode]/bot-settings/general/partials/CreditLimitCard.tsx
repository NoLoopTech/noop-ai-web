"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Switch } from "@radix-ui/react-switch"
import { IconExclamationCircle } from "@tabler/icons-react"
import React, { useState } from "react"

const CreditLimitCard = () => {
  const [isCreditsLimitingEnabled, setIsCreditsLimitingEnabled] =
    useState(false)

  return (
    <Card className="opacity-50">
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col space-y-1">
            <CardTitle>
              Credits limit{" "}
              <span className="text-xs font-normal opacity-40">
                (Coming Soon)
              </span>
            </CardTitle>
            <CardDescription>
              Sets the credit usage cap for this agent, based on your
              workspace’s available credits.
            </CardDescription>
          </div>

          <Switch disabled onCheckedChange={setIsCreditsLimitingEnabled} />
        </div>
      </CardHeader>
      <CardContent className="w-full p-0">
        {isCreditsLimitingEnabled && (
          <div className="flex w-full flex-col space-y-2 p-5 pt-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Set credits limit on agent:</p>
              <IconExclamationCircle className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="w-80 rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-400">
              <p>0</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CreditLimitCard
