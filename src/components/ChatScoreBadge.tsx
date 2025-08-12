import { cva, VariantProps } from "class-variance-authority"
import clsxm from "@/utils/clsxm"
import { IconBolt } from "@tabler/icons-react"

const scoreBadge = cva(
  "flex items-center gap-x-2 px-2 py-0.5 rounded-lg border-3 text-badge-foreground font-medium text-xs shadow-badge-shadow",
  {
    variants: {
      variant: {
        Positive:
          "bg-badge-positive-background border-badge-positive-border dark:text-foreground",
        Negative:
          "bg-badge-negative-background border-badge-negative-border dark:text-foreground",
        Normal:
          "bg-badge-normal-background border-badge-normal-border dark:text-foreground"
      }
    },
    defaultVariants: {
      variant: "Positive"
    }
  }
)

type ScoreBadgeProps = VariantProps<typeof scoreBadge> & {
  value: string
  className?: string
}

export default function ChatScoreBadge({
  variant,
  value,
  className
}: ScoreBadgeProps) {
  return (
    <div className={clsxm(scoreBadge({ variant }), className)}>
      <IconBolt width={16} height={16} />
      {value}
    </div>
  )
}
