"use client"

import { useEffect, useRef } from "react"

export function SvgShineGradient() {
  const gradientRef = useRef<SVGLinearGradientElement>(null)

  useEffect(() => {
    let frame: number
    let offset = 0
    function animate() {
      offset = (offset + 2) % 200
      if (gradientRef.current) {
        gradientRef.current.setAttribute(
          "gradientTransform",
          `translate(${offset},0)`
        )
      }
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <linearGradient
          id="svg-shine-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          ref={gradientRef}
        >
          <stop offset="25%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="75%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient
          id="svg-shine-gradient-dark"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="25%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="75%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </svg>
  )
}
