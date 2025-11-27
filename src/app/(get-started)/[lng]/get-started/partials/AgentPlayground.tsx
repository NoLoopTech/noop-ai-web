"use client"

import AgentDetails from "./playground-contents/AgentDetails"
import AgentPreview from "./playground-contents/AgentPreview"
import CTASection from "./playground-contents/CTASection"

const AgentPlayground = () => {
  return (
    <div className="mt-1 flex h-[calc(100vh-12.2rem)] w-full items-start justify-between space-x-4 rounded-md bg-[url('/assets/images/onboarding-playground-bg.jpg')] bg-cover bg-center p-4 px-12 py-5">
      <AgentDetails />

      <AgentPreview />

      <CTASection />
    </div>
  )
}

export default AgentPlayground
