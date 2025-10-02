export function getContrastTextColor(hex: string): string {
  const cleanedHex = hex.replace("#", "")

  const r = parseInt(cleanedHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanedHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanedHex.substring(4, 6), 16) / 255

  const transform = (channel: number) =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)

  const R = transform(r)
  const G = transform(g)
  const B = transform(b)

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B

  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}
