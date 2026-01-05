import type { UserRole } from "@/models/user"

export const roleRedirectMap: Record<UserRole, string> = {
  admin: "/admin",
  super_admin: "/admin",
  // conductor: "/admin",
  trainee: "/admin"
}
