import { useState, useRef, useEffect } from "react"

interface UseInViewLazyOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInViewLazy({
  threshold = 0.1,
  rootMargin = "100px",
  triggerOnce = true
}: UseInViewLazyOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}
