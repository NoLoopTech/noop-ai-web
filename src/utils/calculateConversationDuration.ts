export const calculateConversationDuration = (
  startTime: string,
  endTime: string
): string => {
  if (!startTime || !endTime) {
    return "0 secs"
  }

  const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()

  if (durationMs <= 0) {
    return "0 secs"
  }

  const totalSeconds = Math.round(durationMs / 1000)

  if (totalSeconds < 60) {
    return "< 1min"
  }

  const totalMinutes = Math.round(totalSeconds / 60)

  if (totalMinutes < 60) {
    return `${totalMinutes} mins`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const hourString = `${hours} h`
  const minuteString = minutes > 0 ? ` ${minutes} mins` : ""

  return `${hourString}${minuteString}`
}
