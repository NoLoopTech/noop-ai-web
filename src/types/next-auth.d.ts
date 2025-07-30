import type { User as ApiUser } from "@/models/user"
declare module "next-auth" {
  // interface User extends ApiUser {}
  // INFO: removed due to this error => An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-object-type

  interface Session {
    user: ApiUser
    apiToken: string
  }
}
declare module "next-auth/jwt" {
  // interface JWT extends ApiUser {}
  // INFO: removed due to this error => An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-object-type
  // TODO: we probably don't need this module declaration at all?
}
