import { withAuth } from "next-auth/middleware"
import stackMiddlewares from "@/middlewares/stackMiddlewares"
import { withLocaleRedirection } from "./middlewares/withLocaleRedirection"
import { type UserRole } from "./models/user"

export default withAuth(stackMiddlewares([withLocaleRedirection]), {
  callbacks: {
    authorized: ({ req, token }) => {
      // INFO: the protected routes each role has access to
      const gatedRoutes: Record<UserRole, string[]> = {
        admin: ["/admin/"],
        super_admin: ["/admin/"],
        trainee: ["/admin/"] // TODO: trainee ideally should not have access to admin routes, but for now we allow it
      }
      const protectedRoutes = Object.values(gatedRoutes).flat() // INFO: generate protected route list from gatedRoutes (might have duplicates)

      const isProtectedRoute =
        protectedRoutes.findIndex(protectedRoute =>
          req.nextUrl.pathname.includes(protectedRoute)
        ) > -1

      if (!isProtectedRoute) {
        return true
      } else if (isProtectedRoute && token) {
        if (
          gatedRoutes[token.role]?.findIndex(protectedRoute =>
            req.nextUrl.pathname.includes(protectedRoute)
          ) > -1
        ) {
          return true
        }
      }
      return false
    }
  }
})
