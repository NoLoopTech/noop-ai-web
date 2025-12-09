import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"

import { authenticate, emailVerify, gauth } from "@/services/authService"

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/en/login" // TODO: remove lng prefix
  },
  providers: [
    CredentialsProvider({
      name: "EmailVerify",
      id: "emailverify",
      credentials: {
        code: { type: "text" }
      },
      async authorize(credentials) {
        if (credentials) {
          const res = await emailVerify(credentials.code)
          if (res) {
            return { ...res.user, apiToken: res.access_token }
          } else {
            return null
          }
        } else {
          return null
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (typeof credentials !== "undefined") {
          const res = await authenticate(
            credentials.email,
            credentials.password
          )
          if (typeof res !== "undefined") {
            return { ...res.user, apiToken: res.access_token }
          } else {
            return null
          }
        } else {
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      const sanitizedToken = Object.keys(token).reduce((p, c) => {
        if (c !== "iat" && c !== "exp" && c !== "jti" && c !== "apiToken") {
          return { ...p, [c]: token[c] }
        } else {
          return p
        }
      }, {})
      return { ...session, user: sanitizedToken, apiToken: token.apiToken }
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && account.id_token) {
        const email =
          (profile as { email?: string } | null | undefined)?.email ??
          (token.email as string | undefined) ??
          ""
        const res = await gauth(email, account.id_token as string)
        if (res) {
          return { ...res.user, apiToken: res.access_token } as JWT
        }
        return token
      }

      if (user) {
        return user as JWT
      }

      return token
    }
  }
}
