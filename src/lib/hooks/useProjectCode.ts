import { useParams } from "next/navigation"
import { useApiQuery } from "@/query"

export function useProjectCodeString(): string | null {
  const params = useParams()
  return (params as { projectCode?: string }).projectCode ?? null
}

export function useProjectCode(): number | "no-project" | null {
  const code = useProjectCodeString()
  const isNoProject = code === "no-project"
  const parsed = code ? parseInt(code, 10) : NaN

  const shouldEnable = !!code && !isNoProject && isNaN(parsed)
  const query = useApiQuery<number>(
    ["project-id", code],
    `user/me/project-id/${encodeURIComponent(code ?? "")}`,
    () => ({ method: "get" }),
    { enabled: shouldEnable }
  )

  // INFO: If numeric in URL, return it synchronously; otherwise return resolved id
  // INFO: If user has no projects, return "no-project"
  if (isNoProject) return "no-project"
  if (!code) return null
  if (!isNaN(parsed)) return parsed
  return query.data ?? null
}
