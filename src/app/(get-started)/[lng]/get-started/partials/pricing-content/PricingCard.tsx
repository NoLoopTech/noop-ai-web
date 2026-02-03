"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SlidingNumber } from "@/components/ui/sliding-number"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

interface Feature {
  name: string
  textColor?: string
  icon?: React.ElementType // INFO: Compatible with icons from @tabler/icons or lucide-react
  iconColor?: string
  iconWidth?: number
  iconHeight?: number
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  LKR = "LKR",
  CONTACT_SALES = "CONTACT_SALES"
}

interface PricingCardProps {
  title: {
    text: string
    icon?: React.ElementType // INFO: Compatible with icons from @tabler/icons or lucide-react
    iconColor?: string
    iconWidth?: number
    iconHeight?: number
  }
  billingPeriod: "monthly" | "yearly"
  highlighted?: boolean
  highlightText?: string
  currency?: Currency
  monthlyPrice?: string
  yearlyPrice?: string
  features: readonly Feature[]
  buttonText: string
  onButtonClick: () => void
  comingSoon: boolean
}

const PricingCard = ({
  title,
  highlighted,
  highlightText,
  currency,
  monthlyPrice,
  yearlyPrice,
  billingPeriod,
  features,
  buttonText,
  onButtonClick,
  comingSoon = false
}: PricingCardProps) => {
  const [animatedText, setAnimatedText] = useState(
    billingPeriod === "monthly" ? "month" : "year"
  )

  useEffect(() => {
    const target = billingPeriod === "monthly" ? "month" : "year"
    setAnimatedText("")
    const timeouts: NodeJS.Timeout[] = []
    target.split("").forEach((char, i) => {
      const timeout = setTimeout(() => {
        setAnimatedText(prev => prev + char)
      }, i * 30)
      timeouts.push(timeout)
    })
    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [billingPeriod])

  const getDisplayNumber = () => {
    const m = monthlyPrice ?? ""
    const y = yearlyPrice ?? ""

    if (billingPeriod === "monthly") {
      if (m !== "") return m
      if (y !== "") return y
      return "0"
    }

    // billingPeriod === "yearly"
    if (y !== "") return y

    // If yearly is an empty string, try to compute from monthly.
    const mNum = parseFloat(m)
    if (!isNaN(mNum)) {
      const yearly = Math.round(mNum * 12)
      return String(yearly)
    }

    return m || "0"
  }

  return (
    <div className="flex h-full w-72 flex-col">
      {/* Pricing Card highlight. add highlighting like "Popular" */}
      <div
        className={`-mb-2.5 flex w-full items-center justify-center rounded-t-xl ${highlighted && highlightText ? "bg-gradient-to-r from-[#093AD7] to-[#0072F4]" : "bg-transparent"} pt-1 pb-4`}
      >
        <p className="text-sm font-bold text-white">
          {highlighted && highlightText ? highlightText : "\u00A0"}
          {/* \u00A0 is used to render a non-breaking space to maintain layout consistency */}
        </p>
      </div>

      {/* main content */}
      <div
        className={`bg-white ${currency === Currency.CONTACT_SALES ? "" : "flex h-[calc(100%-2rem)] min-h-max w-full"} flex-col items-start justify-between rounded-lg border border-zinc-300 px-4 py-5`}
      >
        <div>
          {/* Tier title */}
          <div className="flex items-center space-x-2 text-lg font-semibold text-zinc-950">
            {title.icon && (
              <title.icon
                color={title.iconColor}
                width={title.iconWidth}
                height={title.iconHeight}
              />
            )}
            <span>{title.text}</span>
          </div>

          {/* Tier price */}
          <div className="flex flex-col items-start justify-center space-y-3.5 pt-8">
            {currency === Currency.CONTACT_SALES ? (
              <h1 className="flex w-max items-center text-4xl leading-5 font-normal text-zinc-950">
                Contact Sales
              </h1>
            ) : (
              <h1 className="flex items-center text-[40px] leading-5 font-normal text-zinc-950">
                {currency === Currency.USD
                  ? "$"
                  : currency === Currency.EUR
                    ? "€"
                    : "LKR"}
                <SlidingNumber
                  number={getDisplayNumber()}
                  decimalPlaces={0}
                  className="ml-1"
                />
              </h1>
            )}

            {/* payment period */}
            {currency !== Currency.CONTACT_SALES && (
              <div className="flex space-x-1 text-xs font-normal text-zinc-500">
                <p>per</p>
                <div className="">
                  {animatedText.split("").map((char, i) => (
                    <motion.span
                      key={char + i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      style={{ display: "inline-block" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6 w-full" />

          {/* tier features */}
          {features.length > 0 && (
            <div className="mb-8 w-full">
              <ul className="flex flex-col space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {feature.icon && (
                      <feature.icon
                        color={feature.iconColor}
                        width={feature.iconWidth}
                        height={feature.iconHeight}
                      />
                    )}
                    <span
                      className="text-sm text-zinc-800"
                      style={{
                        color: feature.textColor ? feature.textColor : ""
                      }}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* subscribe button */}
        <Button
          onClick={onButtonClick}
          className="h-11 w-full bg-gradient-to-r from-[#093AD7] to-[#0072F4] text-sm font-medium text-zinc-50 hover:from-[#093AD7]/85 hover:to-[#0072F4]/85"
          disabled={comingSoon}
        >
          {comingSoon ? "Coming Soon" : buttonText}
        </Button>
      </div>
    </div>
  )
}

export default PricingCard
