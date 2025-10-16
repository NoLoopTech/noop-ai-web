import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import React from "react"

const DeleteAgentCard = () => {
  return (
    <Card className="border border-red-600">
      <CardHeader>
        <CardTitle>
          Delete agent{" "}
          <span className="text-xs font-normal opacity-40">(Coming Soon)</span>
        </CardTitle>
        <CardDescription>
          Deleting your agent is permanent and cannot be undone. Please proceed
          only if you're sure.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-center justify-end">
        <Button
          disabled
          variant="destructive"
          className="cursor-not-allowed py-5"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}

export default DeleteAgentCard
