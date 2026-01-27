type AutoByteUnit = "KB" | "MB" | "GB"

/**
 * Converts raw bytes into a human-readable string using
 * auto-detected KB / MB / GB units.
 *
 * Rules:
 * - Default decimal precision = 2
 * - Precision increases dynamically for very small values
 *
 * @param bytes - Raw byte value
 * @returns Formatted size string (e.g. "0.125 KB", "2.34 MB")
 */
export default function convertBytesToUnits(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0.00 KB"
  }

  /**
   * Unit thresholds
   */
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  let unit: AutoByteUnit
  let value: number

  /**
   * Auto unit detection
   */
  if (bytes >= GB) {
    unit = "GB"
    value = bytes / GB
  } else if (bytes >= MB) {
    unit = "MB"
    value = bytes / MB
  } else {
    unit = "KB"
    value = bytes / KB
  }

  /**
   * Dynamic decimal precision
   *
   * Default = 2 decimals
   * Increase precision only when value is small
   */
  let decimals = 2

  if (value < 0.1) {
    decimals = 4
  } else if (value < 1) {
    decimals = 3
  }

  return `${value.toFixed(decimals)} ${unit}`
}
