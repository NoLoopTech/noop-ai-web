/**
 * WorldMap Component
 * ------------------
 * Renders an interactive world map using D3, TopoJSON, and SVG.
 * Note: This file is a backup of a React component (.tsx).
 *
 * Features:
 * - Loads country shapes from TopoJSON (Natural Earth dataset)
 * - Uses D3's geoMercator projection for accurate world rendering
 * - Colors countries based on provided data (countryData prop)
 * - Supports smooth zoom and pan, limited to the SVG area
 * - Shows tooltips on hover with country names
 * - Accessible and modular, written in TypeScript
 *
 * Usage:
 * <WorldMap
 *   countryData={{ India: 120, China: 150 }}
 *   dataFillColor="#0369A1"
 *   defaultFillColor="#D1D5DB"
 *   borderColor="#9CA3AF"
 *   hoverColor="#60A5FA"
 *   tooltipRenderer={(name, value) => <div>{name}: {value}</div>}
 * />
 *
 * Props:
 * - countryData: Record<string, number>
 *   Object mapping country names to numeric values for coloring.
 *   If a country is missing, it is rendered in default gray.
 * - onlyHoverDataCountries?: boolean
 *   If true, only countries with data can be hovered.
 * - dataFillColor?: string
 *   Fill color for countries with data. If not provided, uses dynamic scale.
 * - defaultFillColor?: string
 *   Fill color for countries without data. Defaults to "#E5E7EB".
 * - borderColor?: string
 *   Stroke color for country borders. Defaults to "#374151".
 * - hoverColor?: string
 *   Fill color on hover. If not provided, lightens the original color.
 * - tooltipRenderer?: (countryName: string, value?: number) => React.ReactNode
 *   Optional function to render custom tooltip content.
 *
 * Styling:
 * - Uses TailwindCSS for base styles (can be customized)
 *
 * Data:
 * - TopoJSON is imported from 'world-atlas/countries-50m.json'
 *   (see types/world-atlas.d.ts for type safety)
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { select } from "d3-selection"
import { geoMercator, geoPath } from "d3-geo"
import { zoom as d3zoom, D3ZoomEvent } from "d3-zoom"
import { feature } from "topojson-client"
import world50m from "world-atlas/countries-50m.json"

/**
 * Props for WorldMap
 * @property countryData - Optional mapping of country names to numeric values for coloring
 * @property onlyHoverDataCountries - If true, only countries with data can be hovered
 * @property dataFillColor - Fill color for countries with data
 * @property defaultFillColor - Fill color for countries without data
 * @property borderColor - Stroke color for borders
 * @property hoverColor - Fill color on hover
 * @property tooltipRenderer - Optional function to render custom tooltip content
 */
type WorldMapProps = {
  countryData?: Record<string, number>
  onlyHoverDataCountries?: boolean
  dataFillColor?: string
  defaultFillColor?: string
  borderColor?: string
  hoverColor?: string
  tooltipRenderer?: (countryName: string, value?: number) => React.ReactNode
}

const MAP_ASPECT_RATIO = 0.52 // Approximate width-to-height ratio for Mercator view
const INITIAL_WIDTH = 900
const INITIAL_HEIGHT = Math.round(INITIAL_WIDTH * MAP_ASPECT_RATIO)
const PADDING_RATIO = 0

const deriveDimensions = (width: number, height: number) => {
  if (width <= 0) {
    return { width: INITIAL_WIDTH, height: INITIAL_HEIGHT }
  }

  const fallbackHeight = width * MAP_ASPECT_RATIO
  if (height <= 0) {
    return { width, height: fallbackHeight }
  }

  return { width, height: Math.min(height, fallbackHeight) }
}

const resolveHighlightColor = (baseColor: string, hoverColor?: string) => {
  if (hoverColor) {
    return hoverColor
  }

  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/i)
  if (hslMatch) {
    const [, hue, saturation, lightness] = hslMatch
    const nextLightness = Math.min(100, Number(lightness) + 15)
    return `hsl(${hue}, ${saturation}%, ${nextLightness}%)`
  }

  return baseColor
}

/**
 * Main WorldMap functional component
 * @param countryData - Optional mapping of country names to values for coloring
 */
export default function WorldMap({
  countryData,
  onlyHoverDataCountries = false,
  dataFillColor,
  defaultFillColor = "#E5E7EB",
  borderColor = "#374151",
  hoverColor = "#60A5FA",
  tooltipRenderer
}: WorldMapProps) {
  // Ref for SVG element to bind D3 zoom and rendering
  const svgRef = useRef<SVGSVGElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Tooltip state: stores position and country name
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    content: React.ReactNode
  } | null>(null)

  // Dynamic dimensions state
  const [dimensions, setDimensions] = useState({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT
  })
  const [isDragging, setIsDragging] = useState(false)

  // Measure parent container on mount and resize
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const nextDimensions = deriveDimensions(width, height)
        setDimensions(prev => {
          if (
            Math.abs(prev.width - nextDimensions.width) < 0.5 &&
            Math.abs(prev.height - nextDimensions.height) < 0.5
          ) {
            return prev
          }
          return nextDimensions
        })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  const { width, height } = dimensions

  // Zoom limits
  const minZoom = 1
  const maxZoom = 8

  useEffect(() => {
    // Only run if SVG ref is available
    if (!svgRef.current) return

    // Select SVG and clear previous content
    const svg = select<SVGSVGElement, undefined>(svgRef.current)
    svg.selectAll("*").remove()

    // Create a group for map shapes
    const g = svg.append("g")

    /**
     * Convert TopoJSON to GeoJSON FeatureCollection
     * world-atlas exports TopoJSON topology; see types/world-atlas.d.ts for type safety
     */
    const countriesGeo = feature(
      world50m,
      world50m.objects.countries
    ) as GeoJSON.FeatureCollection

    // Filter out Antarctica
    const filteredCountries = countriesGeo.features.filter(
      d => (d.properties as { name?: string })?.name !== "Antarctica"
    )

    const projection = geoMercator()
    const path = geoPath(projection)

    const safeWidth = Math.max(width, 1)
    const safeHeight = Math.max(height, 1)
    const padding = Math.min(safeWidth, safeHeight) * PADDING_RATIO
    projection.fitExtent(
      [
        [padding, padding],
        [safeWidth - padding, safeHeight - padding]
      ],
      { type: "FeatureCollection", features: filteredCountries }
    )

    /**
     * Color scale for countries based on changePercentage
     * - Red for negative changes, green for positive, gray for zero
     * - If dataFillColor is provided, use it for all data countries instead of scale
     */
    const values = countryData ? Object.values(countryData) : []
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 0
    const colorFor = (value?: number) => {
      if (value === undefined || value === 0) return defaultFillColor
      if (dataFillColor) return dataFillColor // Use provided color if available
      const absMax = Math.max(Math.abs(minValue), Math.abs(maxValue))
      if (absMax === 0) return defaultFillColor
      const ratio = value / absMax // normalize to -1 to 1
      if (ratio > 0) {
        // Green for positive
        const lightness = 78 - ratio * 38
        return `hsl(120, 60%, ${lightness}%)`
      } else {
        // Red for negative
        const lightness = 78 - Math.abs(ratio) * 38
        return `hsl(0, 60%, ${lightness}%)`
      }
    }

    /**
     * Draw country shapes
     * - Each country is a <path>
     * - Fill color based on countryData
     * - Stroke for boundaries
     */
    const countryPaths = g
      .selectAll<SVGPathElement, GeoJSON.Feature>("path")
      .data(filteredCountries)
      .enter()
      .append("path")
      .attr("d", d => path(d as GeoJSON.Feature)!)
      .attr("fill", d => {
        const name = ((d.properties as { name?: string } | undefined)?.name ??
          "") as string
        const value = countryData?.[name]
        return value !== undefined ? colorFor(value) : defaultFillColor
      })
      .attr("stroke", borderColor)
      .attr("stroke-width", 0.4)

    /**
     * Tooltip and hover interaction
     * - If onlyHoverDataCountries is true, only attach to countries present in countryData
     * - Otherwise, attach to all countries
     * - Shows country name on hover
     * - Highlights country on pointermove
     * - Restores color on pointerleave
     */
    const hoverablePaths = onlyHoverDataCountries
      ? countryPaths.filter(d => {
          const name =
            (d.properties as { name?: string } | undefined)?.name ?? ""
          return Boolean(countryData && countryData[name] !== undefined)
        })
      : countryPaths

    hoverablePaths
      .on(
        "pointermove",
        function (this: SVGPathElement, event: Event, d: GeoJSON.Feature) {
          const name =
            (d.properties as { name?: string } | undefined)?.name ?? "Unknown"
          const value = countryData?.[name]
          const pointer = event as PointerEvent
          setTooltip({
            x: pointer.clientX,
            y: pointer.clientY,
            content: tooltipRenderer ? tooltipRenderer(name, value) : name
          })
          // Highlight with hoverColor if provided, else lighten original
          const originalColor = colorFor(value)
          const highlightColor = resolveHighlightColor(
            originalColor,
            hoverColor
          )
          select(this).attr("fill", highlightColor).attr("cursor", "pointer")
        }
      )
      .on("pointerleave", function (this: SVGPathElement) {
        setTooltip(null)
        // Restore original fill color
        const data = (this as SVGPathElement & { __data__?: GeoJSON.Feature })
          .__data__
        const name =
          (data?.properties as { name?: string } | undefined)?.name ?? ""
        const value = countryData?.[name]
        const original = colorFor(value)
        select(this).attr("fill", original)
      })

    // If onlyHoverDataCountries is true, disable pointer events for non-hoverable countries
    if (onlyHoverDataCountries) {
      countryPaths
        .filter(d => {
          const name =
            (d.properties as { name?: string } | undefined)?.name ?? ""
          return Boolean(!countryData || countryData[name] === undefined)
        })
        .style("pointer-events", "none")
    }

    /**
     * D3 Zoom Behavior
     * - Allows smooth zoom and pan
     * - translateExtent restricts panning to SVG bounds
     */
    const zoomBehavior = d3zoom<SVGSVGElement, undefined>()
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, undefined>) => {
        g.attr("transform", event.transform.toString())
      })

    // Attach zoom behavior to SVG
    svg.call(zoomBehavior)

    /**
     * Cleanup on unmount
     * - Removes D3 listeners and SVG children
     */
    return () => {
      svg
        .on("wheel.zoom", null)
        .on("mousedown.zoom", null)
        .on("mousemove.zoom", null)
        .on("touchstart.zoom", null)
        .on("dblclick.zoom", null)
      svg.selectAll("*").remove()
    }
  }, [
    borderColor,
    countryData,
    dataFillColor,
    defaultFillColor,
    height,
    hoverColor,
    onlyHoverDataCountries,
    tooltipRenderer,
    width
  ])

  /**
   * Render SVG and tooltip
   * - SVG is the map container
   * - Tooltip is shown on hover
   */
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ minHeight: 320 }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "block",
          cursor: isDragging ? "grabbing" : "grab"
        }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      />

      {/* Tooltip: renders the custom React content */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 24,
            top: tooltip.y - 4,
            pointerEvents: "none",
            zIndex: 1000
          }}
          className="flex min-w-max items-center space-x-2.5 rounded-lg bg-white px-2 py-1 shadow-lg dark:bg-zinc-900"
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
