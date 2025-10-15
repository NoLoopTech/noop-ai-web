"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconUsers } from "@tabler/icons-react"

export default function LeadsOpportunitiesTab() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <IconUsers size={32} className="text-muted-foreground" />
          </div>
          <CardTitle>Leads & Opportunities Analytics</CardTitle>
          <CardDescription>
            Coming soon - Track lead generation, conversion rates, and sales
            opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            This tab will include:
          </p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            <li>
              • Lead generation metrics - Total Leads, Lead Converstion Rate,
              Lead Generation Rate, Avg. Lead Response Time
            </li>
            <li>• Most Lead Generated Intents</li>
            <li>• Lead Growth Overtime</li>
            <li>• Smart Highlights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
