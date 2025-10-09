import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className
}: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(maxRating, rating))

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const fillPercentage = Math.max(
          0,
          Math.min(100, (clampedRating - index) * 100)
        )

        return (
          <div
            key={index}
            className="relative"
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              className="text-muted-foreground/30 absolute"
              strokeWidth={1.5}
            />

            <div
              className="absolute overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className="fill-yellow-400 text-yellow-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )
      })}
      <span className="text-muted-foreground ml-1 text-sm">
        {clampedRating.toFixed(1)}
      </span>
    </div>
  )
}
