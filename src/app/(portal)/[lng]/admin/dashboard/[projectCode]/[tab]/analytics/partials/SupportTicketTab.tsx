"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconTicket } from "@tabler/icons-react"

export default function SupportTicketTab() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <IconTicket size={32} className="text-muted-foreground" />
          </div>
          <CardTitle>Support & Ticket Analytics</CardTitle>
          <CardDescription>
            Coming soon - Track support tickets, response times, and resolution
            rates
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            This tab will include:
          </p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            <li>
              • Total Tickets, Active Tickets, In Progress Tickets, Avg. Ticket
              Response Time
            </li>
            <li>• Ticket Category Breakdown</li>
            <li>• Smart Alerts </li>
            <li>• Smart Highlights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
