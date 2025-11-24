"use client"

import React, { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getCountryName } from "@/utils/getCountryName"
import WorldMap from "../WorldMap"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"

interface CountryData {
  countryCode: string
  value: number
  changePercentage?: number
  trend?: "up" | "down"
}

interface CountryTrafficMapProps {
  data?: CountryData[]
  defaultFill?: string
  stroke?: string
  className?: string
}

export function CountryTrafficMap({
  data = [],
  defaultFill = "#DEDEDE",
  stroke = "#fff",
  className = ""
}: CountryTrafficMapProps) {
  const worldMapData = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(item => {
      const countryName = getCountryName(item.countryCode)
      if (countryName && item.changePercentage !== undefined) {
        map[countryName] = item.changePercentage
      }
    })
    return map
  }, [data])

  const nameToDataMap = useMemo(() => {
    const map = new Map<string, CountryData>()
    data.forEach(item => {
      const name = getCountryName(item.countryCode)
      if (name) map.set(name, item)
    })
    return map
  }, [data])

  const renderTooltip = (countryName: string): React.ReactNode => {
    const countryData = nameToDataMap.get(countryName)
    if (!countryData) return <div>{countryName}</div>

    const countryCode = countryData.countryCode
    return (
      <div className="flex min-w-52 items-center space-x-2.5 rounded-lg bg-white dark:bg-zinc-900">
        <div className="min-h-8 min-w-8 overflow-hidden rounded-full">
          <ReactCountryFlag
            svg
            countryCode={countryCode}
            style={{
              width: "100%",
              height: "100%"
            }}
            className="min-h-8 max-w-8 object-cover"
            title={countryName}
            aria-label={`${countryName} flag`}
          />
        </div>

        <div className="flex w-full flex-col items-start">
          <p className="w-max text-sm font-normal text-zinc-600 dark:text-zinc-500">
            {countryName}
          </p>

          <div className="flex w-full items-center justify-between">
            <div className="text-base text-zinc-900 dark:text-zinc-400">
              {countryData.value.toFixed(2)}%
            </div>

            {countryData.changePercentage !== undefined &&
              countryData.trend && (
                <div
                  className="flex items-end space-x-1 text-xs"
                  style={{
                    color: countryData.trend === "up" ? "#34C759" : "#EF4444"
                  }}
                >
                  {countryData.trend === "up" ? (
                    <IconCaretUpFilled size={14} className="text-inherit" />
                  ) : (
                    <IconCaretDownFilled size={14} className="text-inherit" />
                  )}

                  <p className="text-inherit">
                    {Math.abs(countryData.changePercentage)}%
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-full w-full bg-white ${className} relative overflow-hidden`}
    >
      <WorldMap
        countryData={worldMapData}
        onlyHoverDataCountries={true}
        dataFillColor="#0369A1"
        defaultFillColor={defaultFill}
        borderColor={stroke}
        hoverColor="#60A5FA"
        tooltipRenderer={renderTooltip}
      />
    </div>
  )
}
