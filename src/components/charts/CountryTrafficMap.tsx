"use client"

import React, { useMemo, useState, useEffect } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "@vnedyalk0v/react19-simple-maps"

interface CountryData {
  countryCode: string
  value: number
}

interface GeoJsonData {
  type: string
  features: Array<{
    type: string
    properties: Record<string, unknown>
    geometry: unknown
  }>
}

interface CountryTrafficMapProps {
  data?: CountryData[]
  colorScale?: {
    min: string
    max: string
  }
  defaultFill?: string
  stroke?: string
  hoverStroke?: string
  className?: string
}

export function CountryTrafficMap({
  data = [],
  colorScale = {
    min: "#E0F2FE",
    max: "#0369A1"
  },
  defaultFill = "#D1D5DB",
  stroke = "#9CA3AF",
  hoverStroke = "#374151",
  className = ""
}: CountryTrafficMapProps) {
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the GeoJSON data on mount
  useEffect(() => {
    fetch("/data/world.geojson")
      .then(res => res.json())
      .then(data => {
        setGeoData(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Create a map of country codes to data for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, CountryData>()
    data.forEach(item => {
      map.set(item.countryCode, item)
    })
    return map
  }, [data])

  // Calculate min and max values for color scaling
  const { minValue, maxValue } = useMemo(() => {
    if (data.length === 0) return { minValue: 0, maxValue: 100 }
    const values = data.map(d => d.value)
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    }
  }, [data])

  // Function to get color based on value
  const getColor = (countryCode: string): string => {
    const countryData = dataMap.get(countryCode)
    if (!countryData) return defaultFill

    // Normalize value between 0 and 1
    const normalizedValue =
      maxValue === minValue
        ? 0.5
        : (countryData.value - minValue) / (maxValue - minValue)

    // Interpolate between min and max colors
    return interpolateColor(colorScale.min, colorScale.max, normalizedValue)
  }

  if (loading || !geoData) {
    return (
      <div
        className={`h-full w-full ${className} flex items-center justify-center`}
      >
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 145
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {/* @ts-expect-error - ZoomableGroup center type issue with branded types */}
        <ZoomableGroup center={[0, 30]} zoom={1}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                const countryCode =
                  (geo.properties?.iso_a2 as string) ||
                  (geo.properties?.ISO_A2 as string) ||
                  (geo.id as string)

                return (
                  <Geography
                    key={`geo-${index}`}
                    geography={geo}
                    fill={getColor(countryCode)}
                    stroke={stroke}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: getColor(countryCode),
                        opacity: 0.8,
                        stroke: hoverStroke,
                        strokeWidth: 1
                      },
                      pressed: { outline: "none" }
                    }}
                    className="transition-all duration-200"
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

// Helper function to interpolate between two hex colors
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Remove the # if present
  const c1 = color1.replace("#", "")
  const c2 = color2.replace("#", "")

  // Convert hex to RGB
  const r1 = parseInt(c1.substring(0, 2), 16)
  const g1 = parseInt(c1.substring(2, 4), 16)
  const b1 = parseInt(c1.substring(4, 6), 16)

  const r2 = parseInt(c2.substring(0, 2), 16)
  const g2 = parseInt(c2.substring(2, 4), 16)
  const b2 = parseInt(c2.substring(4, 6), 16)

  // Interpolate
  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
