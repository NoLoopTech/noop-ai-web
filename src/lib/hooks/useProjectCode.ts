import { useParams } from "next/navigation"
import { useApiQuery } from "@/query"

export function useProjectCodeString(): string | null {
  const params = useParams()
  return (params as { projectCode?: string }).projectCode ?? null
}

export function useProjectCode(): number | null {
  const code = useProjectCodeString()
  const parsed = code ? parseInt(code, 10) : NaN

  const shouldEnable = !!code && isNaN(parsed)
  const query = useApiQuery<number>(
    ["project-id", code],
    `user/me/project-id/${encodeURIComponent(code ?? "")}`,
    () => ({ method: "get" }),
    { enabled: shouldEnable }
  )

  // INFO: If numeric in URL, return it synchronously; otherwise return resolved id
  return !isNaN(parsed) ? parsed : (query.data ?? null)
}
