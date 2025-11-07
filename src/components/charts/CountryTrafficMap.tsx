"use client"

import React, { useMemo, useState, useEffect } from "react"
import {
  ComposableMap,
  Geographies,
  Geography
} from "@vnedyalk0v/react19-simple-maps"
import ReactCountryFlag from "react-country-flag"
import { getCountryName, getCountryCode } from "@/utils/getCountryName"

interface CountryData {
  countryCode: string
  value: number
  changePercentage?: number
  trend?: "up" | "down"
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
  className?: string
}

export function CountryTrafficMap({
  data = [],
  colorScale: _colorScale = {
    min: "#E0F2FE",
    max: "#0369A1"
  },
  defaultFill = "#D1D5DB",
  stroke = "#9CA3AF",
  className = ""
}: CountryTrafficMapProps) {
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCountry, setHoveredCountry] = useState<{
    code: string
    name: string
    data: CountryData
  } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Fetch the GeoJSON data on mount
  useEffect(() => {
    // Use window.location.origin to get absolute path and bypass i18n routing
    // Using world.geojson (207KB) instead of countries.geojson (14MB) for faster loading
    const geoJsonUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/data/world.geojson`
        : "/data/world.geojson"

    fetch(geoJsonUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        return res.json()
      })
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
      // Store all possible case variations
      const code = item.countryCode
      map.set(code, item)
      map.set(code.toUpperCase(), item)
      map.set(code.toLowerCase(), item)
    })
    return map
  }, [data])

  // Calculate min and max values for color scaling (unused but kept for potential future use)
  const { minValue: _minValue, maxValue: _maxValue } = useMemo(() => {
    if (data.length === 0) return { minValue: 0, maxValue: 100 }
    const values = data.map(d => d.value)
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    }
  }, [data])

  // Function to get color based on value
  const getColor = (countryCode: string): string => {
    let countryData = dataMap.get(countryCode)

    // Try uppercase if not found
    if (!countryData && countryCode) {
      countryData = dataMap.get(countryCode.toUpperCase())
    }

    if (!countryData) return defaultFill

    // Always use blue for countries with data
    return "#0369A1"
  }

  // Handle mouse enter on country
  const handleCountryMouseEnter = (
    event: React.MouseEvent<SVGPathElement>,
    countryCode: string,
    countryData: CountryData
  ) => {
    const svgElement = event.currentTarget.ownerSVGElement
    if (svgElement) {
      const rect = svgElement.getBoundingClientRect()
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }
    setHoveredCountry({
      code: countryCode,
      name: getCountryName(countryCode),
      data: countryData
    })
  }

  // Handle mouse move on country
  const handleCountryMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
    if (hoveredCountry) {
      const svgElement = event.currentTarget.ownerSVGElement
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect()
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        })
      }
    }
  }

  // Handle mouse leave from country
  const handleCountryMouseLeave = () => {
    setHoveredCountry(null)
  }

  // Handle mouse leave from the entire map
  const handleMapMouseLeave = () => {
    setHoveredCountry(null)
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
    <div className={`h-full w-full ${className} relative overflow-hidden`}>
      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg border bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center overflow-hidden rounded-full"
              style={{
                width: "1.5rem",
                height: "1.125rem",
                backgroundColor: "#f3f3f3"
              }}
            >
              <ReactCountryFlag
                svg
                countryCode={hoveredCountry.code}
                style={{
                  width: "100%",
                  height: "auto"
                }}
                title={hoveredCountry.name}
                aria-label={`${hoveredCountry.name} flag`}
              />
            </div>
            <div className="text-sm font-semibold">{hoveredCountry.name}</div>
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {hoveredCountry.data.value.toFixed(2)}%
          </div>
          {hoveredCountry.data.changePercentage !== undefined &&
            hoveredCountry.data.trend && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span
                  style={{
                    color:
                      hoveredCountry.data.trend === "up" ? "#34C759" : "#EF4444"
                  }}
                >
                  {hoveredCountry.data.trend === "up" ? "▲" : "▼"}{" "}
                  {Math.abs(hoveredCountry.data.changePercentage)}%
                </span>
              </div>
            )}
        </div>
      )}
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 147,
          // @ts-expect-error - center type issue with branded types
          center: [0, 0]
        }}
        width={800}
        height={400}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100%"
        }}
        className="overflow-hidden"
        onMouseLeave={handleMapMouseLeave}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              // Get country name from world.geojson properties
              const countryName = geo.properties?.name

              // Convert country name to ISO-2 code using our mapping
              let countryCode = countryName ? getCountryCode(countryName) : null

              // If no code found from name, try other properties as fallback
              if (!countryCode) {
                const possibleCodes = [
                  geo.properties?.["ISO3166-1-Alpha-2"],
                  geo.properties?.["ISO3166-1-Alpha-3"],
                  geo.properties?.iso_a2,
                  geo.properties?.ISO_A2,
                  geo.properties?.iso_a2_eh,
                  geo.id
                ].filter(Boolean) as string[]

                countryCode = possibleCodes[0] || null
              }

              // Look up if we have data for this country
              let countryData: CountryData | undefined
              if (countryCode) {
                countryData =
                  dataMap.get(countryCode) ||
                  dataMap.get(countryCode.toUpperCase()) ||
                  dataMap.get(countryCode.toLowerCase())
              }

              const isHovered = hoveredCountry?.code === countryCode
              const hasData = !!countryData

              return (
                <Geography
                  key={`geo-${index}`}
                  geography={geo}
                  fill={
                    hasData && countryCode ? getColor(countryCode) : defaultFill
                  }
                  stroke={stroke}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  style={{
                    default: {
                      outline: "none",
                      cursor: hasData ? "pointer" : "default",
                      transition: "all 0.2s ease-in-out"
                    },
                    hover: {
                      outline: "none",
                      fill: hasData ? "#0284C7" : defaultFill,
                      opacity: hasData ? 0.85 : 1,
                      stroke: hasData ? "#1E293B" : stroke,
                      strokeWidth: hasData ? 2 : 0.5,
                      cursor: hasData ? "pointer" : "default",
                      transition: "all 0.2s ease-in-out"
                    },
                    pressed: {
                      outline: "none",
                      cursor: hasData ? "pointer" : "default",
                      transition: "all 0.2s ease-in-out"
                    }
                  }}
                  onMouseEnter={event => {
                    if (hasData && countryData && countryCode) {
                      handleCountryMouseEnter(event, countryCode, countryData)
                    }
                  }}
                  onMouseMove={handleCountryMouseMove}
                  onMouseLeave={handleCountryMouseLeave}
                  className="transition-all duration-200"
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
