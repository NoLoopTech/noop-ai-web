"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapPlaceholder from "@/../public/assets/map-placeholder.svg"

export default function GeoBreakdownMap() {
  return (
    <Card className="h-96">
      <CardHeader className="flex flex-col space-y-0.5">
        <CardTitle className="text-base font-semibold">
          Country/Geo Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_90px)]">
        <div className="relative flex h-full w-full items-center justify-center overflow-clip rounded-lg">
          <h2 className="absolute z-20 text-center text-lg font-semibold text-zinc-600">
            Coming soon
          </h2>
          <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm"></span>
          <MapPlaceholder className="fill-foreground/50 w-full stroke-zinc-700" />
        </div>
      </CardContent>
    </Card>
  )
}
