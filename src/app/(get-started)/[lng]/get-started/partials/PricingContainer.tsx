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
      text: "Free",
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
        name: "Access to fast models",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "100 message credits/month",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI Action per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "400 KB per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 seat",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Integrations",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "API access",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      }
    ],
    buttonText: "Get Started",
    onButtonClick: () => {},
    comingSoon: false
  },
  {
    title: {
      text: "Pro",
      icon: IconCircleFilled,
      iconColor: "#12C79C",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.USD,
    highlighted: true,
    highlightText: "Popular",
    monthlyPrice: "39",
    yearlyPrice: "93",
    features: [
      {
        name: "Access to fast models",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "100 message credits/month",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI Action per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "400 KB per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 seat",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Integrations",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "API access",
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
      text: " Growth",
      icon: IconCircleFilled,
      iconColor: "#FFB700",
      iconWidth: 16,
      iconHeight: 16
    },
    currency: Currency.USD,
    highlighted: false,
    highlightText: "Popular",
    monthlyPrice: "99",
    yearlyPrice: "193",
    features: [
      {
        name: "Access to fast models",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "100 message credits/month",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI Action per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "400 KB per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 seat",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Integrations",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "API access",
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
    currency: Currency.USD,
    highlighted: false,
    highlightText: "Popular",
    monthlyPrice: "499",
    yearlyPrice: "993",
    features: [
      {
        name: "Access to fast models",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "100 message credits/month",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 AI Action per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "400 KB per AI agent",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "1 seat",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "Integrations",
        textColor: "#27272A",
        icon: IconCheck,
        iconColor: "#27272A",
        iconWidth: 18,
        iconHeight: 18
      },
      {
        name: "API access",
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
        <div className="flex w-full items-end justify-center space-x-5 overflow-hidden">
          <div className="flex w-full items-end justify-center space-x-5">
            {pricingPlans.map((plan, idx) => (
              <PricingCard
                key={idx}
                {...plan}
                monthlyPrice={
                  activeTab === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
                }
                billingPeriod={activeTab}
                onButtonClick={
                  plan.title?.text?.trim() === "Free"
                    ? handleFreeClick
                    : plan.onButtonClick
                }
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default PricingContainer
