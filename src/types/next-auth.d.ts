import type { User as ApiUser } from "@/models/user"
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends ApiUser {}

  interface Session {
    user: ApiUser
    apiToken: string
  }
}
declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends ApiUser {}
}
