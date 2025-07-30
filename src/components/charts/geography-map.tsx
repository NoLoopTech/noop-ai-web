"use client"

import React, { JSX } from "react"
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup
// } from "react-simple-maps"

// Using a simplified world map JSON
// const geoUrl =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export function GeographyMap(): JSX.Element {
  return (
    <div className="h-full w-full">
      {/* <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 145
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup center={[0, 30]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--map-fill)"
                  stroke="var(--map-stroke)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "var(--map-hover)" },
                    pressed: { outline: "none" }
                  }}
                  className="fill-[#D1D5DB] stroke-[#9CA3AF] hover:fill-[#A1A1AA] dark:fill-[#2D3039] dark:stroke-[#1E1E24] dark:hover:fill-[#3B3E4A]"
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap> */}
    </div>
  )
}
