import { ReactNode } from "react"

const truncateFromMiddle = (
  name: string,
  maxLength = 20,
  firstPartLen = 20
): ReactNode => {
  if (!name) return name

  const safeMax = Number.isFinite(maxLength) && maxLength > 0 ? maxLength : 20
  const safeFirst =
    Number.isFinite(firstPartLen) && firstPartLen > 0 ? firstPartLen : 20

  if (name.length <= safeMax) return <span>{name}</span>

  const dotIndex = name.lastIndexOf(".")
  const ext = dotIndex > -1 ? name.substring(dotIndex) : ""
  const base = dotIndex > -1 ? name.substring(0, dotIndex) : name

  const firstPart = base.slice(0, Math.min(safeFirst, base.length))

  return (
    <span className="flex items-baseline">
      <span>{firstPart}</span>
      <span className="mx-0.5 tracking-wider">...</span>
      {ext ? <span>{ext}</span> : null}
    </span>
  )
}

export default truncateFromMiddle
