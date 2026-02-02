"use client"

import { IconCheck, IconCircleFilled } from "@tabler/icons-react"
import PricingCard, { Currency } from "./pricing-content/PricingCard"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

const pricingPlans = [
  {
    title: {
      text: "Starter",
      icon: IconCircleFilled,
      iconColor: "#1C5CFF",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.USD,
    highlighted: false,
    highlightText: "Popular",
    monthlyPrice: "0",
    yearlyPrice: "0",
    features: [
      {
        name: "1 bot, 1 website",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Website AI Chatbot",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Chat History",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Ticketing (AI + manual forms)",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Bot settings (docs upload, persona)",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "General settings (profile, billing)",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      }
    ],
    buttonText: "Subscribe",
    onButtonClick: () => {},
    comingSoon: false
  },
  {
    title: {
      text: "Growth",
      icon: IconCircleFilled,
      iconColor: "#12C79C",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.USD,
    highlighted: true,
    highlightText: "Popular",
    monthlyPrice: "99",
    yearlyPrice: "",
    features: [
      {
        name: "3 bots · 3 websites",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Website AI Chatbot",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Chat History",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Ticketing system",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Lead capture & Leads page",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Lead scoring",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Bot settings (docs, persona, tone)",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Multilingual auto-replies",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      }
    ],
    buttonText: "Subscribe",
    onButtonClick: () => {},
    comingSoon: true
  },
  {
    title: {
      text: "Pro",
      icon: IconCircleFilled,
      iconColor: "#FFB700",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.USD,
    highlighted: false,
    highlightText: "Popular",
    monthlyPrice: "499",
    yearlyPrice: "",
    features: [
      {
        name: "Unlimited bots & websites",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Website AI Chatbot",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Chat history & full analytics",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Leads & opportunities dashboard",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Confidence-based escalation",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "EQ-AI (tone & sentiment detection)",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Multilingual auto-replies",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      }
    ],
    buttonText: "Subscribe",
    onButtonClick: () => {},
    comingSoon: true
  },
  {
    title: {
      text: "Enterprise",
      icon: IconCircleFilled,
      iconColor: "#FF1C99",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.CONTACT_SALES,
    highlighted: false,
    highlightText: "Popular",
    monthlyPrice: "499",
    yearlyPrice: "",
    features: [],
    buttonText: "Contact Now",
    onButtonClick: () => {},
    comingSoon: true
  }
]

const PricingContainer = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly")
  const monthlyRef = useRef<HTMLButtonElement>(null)
  const yearlyRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const ref = activeTab === "monthly" ? monthlyRef : yearlyRef
    if (ref.current) {
      setIndicatorStyle({
        left: ref.current.offsetLeft,
        width: ref.current.offsetWidth
      })
    }
  }, [activeTab])

  const handleFreeClick = useCallback(() => {
    router.push("/admin")
  }, [router])

  return (
    <div className="mb-3 flex w-full flex-col items-center">
      <div className="relative flex space-x-2 rounded-lg border border-zinc-200 bg-white p-1">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-0 left-0 z-0 h-full rounded-md bg-gradient-to-r from-[#15A4A7] to-[#08C4C8]"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            top: 4,
            height: `calc(100% - 8px)`
          }}
        />

        <Button
          ref={monthlyRef}
          variant={activeTab === "monthly" ? "default" : "outline"}
          onClick={() => setActiveTab("monthly")}
          style={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
            border: "none",
            boxShadow: "none"
          }}
          className="text-base font-medium"
        >
          Monthly
        </Button>

        <Button
          ref={yearlyRef}
          variant={activeTab === "yearly" ? "default" : "outline"}
          onClick={() => setActiveTab("yearly")}
          style={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
            border: "none",
            boxShadow: "none"
          }}
          className="text-base font-medium"
        >
          Yearly
        </Button>
      </div>

      <ScrollArea className="mt-10 h-[calc(100vh-17.1rem)] w-full px-4">
        <div className="flex h-[calc(100vh-8rem)] w-full items-start justify-center space-x-5 [@media(min-height:300px)]:h-[600px]">
          {pricingPlans.map((plan, idx) => (
            <PricingCard
              key={idx}
              {...plan}
              billingPeriod={activeTab}
              onButtonClick={
                plan.title?.text?.trim() === "Free"
                  ? handleFreeClick
                  : plan.onButtonClick
              }
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PricingContainer
