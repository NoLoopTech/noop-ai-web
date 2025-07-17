export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    }) +
    " " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    })
  )
}
