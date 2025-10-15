interface TrendIconProps {
  size?: number
  className?: string
}

export function IconTrendingUpTriangle({
  size = 14,
  className
}: TrendIconProps) {
  return (
    <svg
      width={size}
      height={(size * 8) / 14}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.36728 0.397588C7.16931 0.183289 6.83068 0.183289 6.63272 0.397589L0.847085 6.66073C0.55126 6.98097 0.778397 7.5 1.21436 7.5H12.7856C13.2216 7.5 13.4487 6.98096 13.1529 6.66072L7.36728 0.397588Z"
        fill="#34C759"
      />
    </svg>
  )
}

export function IconTrendingDownTriangle({
  size = 14,
  className
}: TrendIconProps) {
  return (
    <svg
      width={size}
      height={(size * 8) / 14}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.63272 7.60241C6.83069 7.81671 7.16932 7.81671 7.36728 7.60241L13.1529 1.33927C13.4487 1.01903 13.2216 0.5 12.7856 0.5H1.21436C0.778398 0.5 0.551262 1.01904 0.847087 1.33928L6.63272 7.60241Z"
        fill="#EF4444"
      />
    </svg>
  )
}
