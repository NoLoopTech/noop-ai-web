"use client"

import { Suspense, ReactNode } from "react"
import { useInViewLazy } from "@/lib/hooks/useInViewLazy"

interface LazyInViewProps {
  children: ReactNode
  fallback?: ReactNode
  placeholder?: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export default function LazyInView({
  children,
  fallback,
  placeholder,
  className = "",
  threshold = 0.1,
  rootMargin = "100px"
}: LazyInViewProps) {
  const { ref, isVisible } = useInViewLazy({
    threshold,
    rootMargin,
    triggerOnce: true
  })

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        placeholder || (
          <div className="bg-muted flex h-96 animate-pulse items-center justify-center rounded-lg">
            <span className="text-muted-foreground"></span>
          </div>
        )
      )}
    </div>
  )
}
