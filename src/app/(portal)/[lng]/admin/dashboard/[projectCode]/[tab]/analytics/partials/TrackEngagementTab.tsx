"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconChartBar } from "@tabler/icons-react"

export default function TrackEngagementTab() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <IconChartBar size={32} className="text-muted-foreground" />
          </div>
          <CardTitle>Track & Engagement</CardTitle>
          <CardDescription>
            Coming soon - Track user engagement, session analytics, and
            interaction patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            This tab will include:
          </p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            <li>
              • User engagement metrics - Total Website Visitors, Bot
              conversations, Peak Visit Times, Repeat Visitors in Chat
            </li>
            <li>• Traffic Trends</li>
            <li>• Top Countries and Bot Traffic By Country chart</li>
            <li>• Smart Highlights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
