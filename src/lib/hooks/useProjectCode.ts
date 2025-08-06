import { useParams } from "next/navigation"

export function useProjectCode(): number | null {
  const params = useParams()
  const projectIdFromUrl = (params as { projectCode?: string }).projectCode
  if (!projectIdFromUrl) return null
  const parsed = parseInt(projectIdFromUrl, 10)
  return isNaN(parsed) ? null : parsed

  // TODO: change to projectCede
}
