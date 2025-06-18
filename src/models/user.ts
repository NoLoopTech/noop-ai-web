// export type UserRole = "admin" | "super_admin" | "conductor" | "customer"

export type UserRole = "admin" | "super_admin" | "trainee"
export interface User {
  id: string
  activated: boolean
  email: string
  fullname: string
  role: UserRole
  apiToken: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  passwordUpdatedAt: string
  iosDeviceToken: string
}

export interface AuthResponse {
  user: User
  access_token: string
  isNewUser: boolean
}
