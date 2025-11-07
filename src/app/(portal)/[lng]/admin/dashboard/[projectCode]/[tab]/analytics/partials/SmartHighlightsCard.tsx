"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconSparkles } from "@tabler/icons-react"

export interface SmartHighlightsData {
  bullets: string[]
  overall: string
}

export interface SmartHighlightsCardProps {
  /**
   * The smart highlights data containing bullets and overall summary
   */
  data?: SmartHighlightsData | null

  /**
   * Whether the data is currently loading
   */
  isLoading?: boolean

  /**
   * Whether there was an error fetching the data
   */
  isError?: boolean

  /**
   * Custom className for the card wrapper
   */
  className?: string

  /**
   * Callback when the "Learn More" button is clicked
   */
  onLearnMore?: () => void

  /**
   * Whether to show the Learn More button
   * @default true
   */
  showLearnMore?: boolean
}

/**
 * SmartHighlightsCard - A reusable component for displaying AI-generated insights
 *
 * This component displays smart highlights with bullet points and an overall summary.
 * It handles loading states, error states, and empty states gracefully.
 *
 * @example
 * ```tsx
 * <SmartHighlightsCard
 *   data={smartHighlightsData}
 *   isLoading={isLoading}
 *   isError={isError}
 *   onLearnMore={() => console.log('Learn more clicked')}
 * />
 * ```
 */
export function SmartHighlightsCard({
  data,
  isLoading = false,
  isError = false,
  className = "",
  onLearnMore,
  showLearnMore = true
}: SmartHighlightsCardProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle
          className="text-base font-semibold"
          style={{ color: "#9F9FA1" }}
        >
          Smart Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading ? (
          // Loading State
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="shine h-12 w-full rounded-md" />
            ))}
          </div>
        ) : isError ? (
          // Error State
          <div className="flex flex-1 flex-col items-center justify-center space-y-2 text-center">
            <div className="text-destructive">
              <IconSparkles size={32} className="opacity-50" />
            </div>
            <p className="text-muted-foreground text-sm">
              Unable to load smart highlights. Please try again later.
            </p>
          </div>
        ) : !data || (data.bullets.length === 0 && !data.overall) ? (
          // Empty/Coming Soon State
          <div className="relative flex flex-1 flex-col justify-between space-y-4 overflow-clip rounded-lg">
            <h2 className="text-muted-foreground absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold">
              Coming soon
            </h2>
            <span className="absolute z-10 h-full w-full bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60"></span>
            <div className="space-y-4">
              {/* Placeholder Bullet Points */}
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                  <span>Traffic increased by 32% compared to last week.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                  <span>
                    Returning visitors grew steadily after the product update.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                  <span>
                    Most visits came from organic search around mid-month.
                  </span>
                </li>
              </ul>

              {/* Placeholder Summary */}
              <p className="text-muted-foreground text-sm">
                Overall, the traffic shows a clear upward trend throughout the
                month, with noticeable spikes during campaign periods and
                product updates. The steady growth suggests that current
                strategies are effective.
              </p>
            </div>

            {/* Placeholder Learn More Button */}
            {showLearnMore && (
              <div className="flex justify-end">
                <button
                  disabled
                  className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white opacity-50 transition-all"
                  style={{
                    background:
                      "linear-gradient(90deg, #63E2FF 0%, #903A7E 100%)"
                  }}
                >
                  <span>Learn More</span>
                  <IconSparkles size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          // Data Loaded State
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Bullet Points */}
              {data.bullets.length > 0 && (
                <ul className="space-y-2">
                  {data.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Overall Summary */}
              {data.overall && (
                <p className="text-muted-foreground text-sm">{data.overall}</p>
              )}
            </div>

            {/* Learn More Button */}
            {showLearnMore && (
              <div className="flex justify-end">
                <button
                  onClick={onLearnMore}
                  className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(90deg, #63E2FF 0%, #903A7E 100%)"
                  }}
                >
                  <span>Learn More</span>
                  <IconSparkles size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
