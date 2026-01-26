// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBotBehaviorDescription = (data: any): string => {
  try {
    if (typeof data === "string") return data
    if (data && typeof data === "object")
      return data.message ?? JSON.stringify(data)
    return String(data)
  } catch (_err) {
    return ""
  }
}

export default getBotBehaviorDescription
