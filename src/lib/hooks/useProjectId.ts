import { useParams } from "next/navigation"

export function useProjectId(): number | null {
  const params = useParams()
  const projectIdFromUrl = (params as { projectcode?: string }).projectcode
  if (!projectIdFromUrl) return null
  const parsed = parseInt(projectIdFromUrl, 10)
  return isNaN(parsed) ? null : parsed
}
