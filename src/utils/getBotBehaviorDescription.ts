// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBotBehaviorDescription = (data: any): string => {
  try {
    let desc = ""
    if (typeof data === "string") desc = data
    else if (data && typeof data === "object")
      desc = data.message ?? JSON.stringify(data)
    else desc = String(data)

    return desc.replace(/_/g, " ")
  } catch (_err) {
    return ""
  }
}

export default getBotBehaviorDescription
