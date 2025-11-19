"use client"

import { Button } from "@/components/ui/button"

const CTASection = () => {
  return (
    <div className="h-max min-w-72 rounded-[10px] bg-white py-2.5 pr-2 pl-2.5 shadow-md">
      <h2 className="mb-2 text-lg font-semibold text-zinc-950">
        Ready to Go Live?
      </h2>

      <Button className="h-11 w-full bg-gradient-to-r from-[#0736F0] to-[#0088FF] text-sm font-medium text-zinc-50 hover:from-[#0736F0]/85 hover:to-[#0088FF]/85">
        Deploy Agent
      </Button>
    </div>
  )
}

export default CTASection
