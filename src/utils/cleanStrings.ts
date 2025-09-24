export default function cleanStrings(
  pref: string | null | undefined
): string[] {
  if (!pref) return []

  return pref
    .replace(/^[{\[]|[}\]]$/g, "")
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map(s =>
      s
        .trim()
        .replace(/^["']+|["']+$/g, "")
        .replace(/''+/g, "'")
        .replace(/_/g, " ")
        .replace(/[^a-zA-Z0-9 ']/g, "")
    )
    .filter(Boolean)
}
