import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SlidingNumber } from "@/components/ui/sliding-number"

interface Feature {
  name: string
  textColor?: string
  icon?: React.ElementType // INFO: Compatible with icons from or @tabler/icons lucide-react
  iconColor?: string
  iconWidth?: number
  iconHeight?: number
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  LKR = "LKR"
}

interface PricingCardProps {
  title: {
    text: string
    icon?: React.ElementType // INFO: Compatible with icons from or @tabler/icons lucide-react
    iconColor?: string
    iconWidth?: number
    iconHeight?: number
  }
  highlighted?: boolean
  highlightText?: string
  currency?: Currency
  monthlyPrice?: string
  yearlyPrice?: string
  features: readonly Feature[]
  buttonText: string
  onButtonClick: () => void
}

const PricingCard = ({
  title,
  highlighted,
  highlightText,
  currency,
  monthlyPrice,
  yearlyPrice,
  features,
  buttonText,
  onButtonClick
}: PricingCardProps) => {
  return (
    <div className="flex w-72 flex-col">
      {highlighted && highlightText && (
        <div className="-mb-2.5 flex w-full items-center justify-center rounded-t-xl bg-gradient-to-r from-[#093AD7] to-[#0072F4] pt-1 pb-4">
          <p className="text-sm font-bold text-white">{highlightText}</p>
        </div>
      )}

      {/* main content */}
      <div className="flex w-full flex-col items-start justify-center rounded-lg border border-zinc-300 bg-white px-4 py-5">
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
          <h1 className="flex items-center text-[40px] leading-5 font-normal text-zinc-950">
            {currency === Currency.USD
              ? "$"
              : currency === Currency.EUR
                ? "€"
                : "LKR"}
            <SlidingNumber
              number={monthlyPrice ?? yearlyPrice ?? "0"}
              decimalPlaces={0}
              className="ml-1"
            />
          </h1>

          <p className="text-xs font-normal text-zinc-500">
            per {monthlyPrice ? "month" : "year"}
          </p>
        </div>

        <Separator className="mt-8 mb-6 w-full" />

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

        {/* subscribe button */}
        <Button
          onClick={onButtonClick}
          className="h-11 w-full bg-gradient-to-r from-[#093AD7] to-[#0072F4] text-sm font-medium text-zinc-50 hover:from-[#093AD7]/85 hover:to-[#0072F4]/85"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default PricingCard
