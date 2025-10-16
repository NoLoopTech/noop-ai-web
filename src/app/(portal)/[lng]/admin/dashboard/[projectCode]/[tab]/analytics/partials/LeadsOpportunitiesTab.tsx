"use client"

import {
  Card,
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
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
