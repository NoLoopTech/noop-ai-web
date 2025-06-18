import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"

import { authenticate, emailVerify, gauth } from "@/services/authService"
import { jwtDecode } from "jwt-decode"

interface GoogleJwt {
  email: string
  picture: string
  name: string
}

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
      async authorize(credentials, req) {
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
      async authorize(credentials, req) {
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
    CredentialsProvider({
      name: "GoogleSignIn",
      id: "googlesignin",
      credentials: {
        credential: { type: "text" }
      },
      async authorize(credentials, req) {
        try {
          if (typeof credentials !== "undefined") {
            const decodedJwt = jwtDecode<GoogleJwt>(credentials.credential)
            const res = await gauth(decodedJwt.email, credentials.credential)
            if (typeof res !== "undefined") {
              return { ...res.user, apiToken: res.access_token }
            } else {
              console.log("failed")
              return null
            }
          } else {
            return null
          }
        } catch (err) {
          console.log("Error during sign in", err)
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token, user }) {
      const sanitizedToken = Object.keys(token).reduce((p, c) => {
        // strip unnecessary properties
        if (c !== "iat" && c !== "exp" && c !== "jti" && c !== "apiToken") {
          return { ...p, [c]: token[c] }
        } else {
          return p
        }
      }, {})
      return { ...session, user: sanitizedToken, apiToken: token.apiToken }
    },
    async jwt({ token, user, account, profile }) {
      if (typeof user !== "undefined") {
        // user has just signed in so the user object is populated
        return user as JWT
      }
      return token
    }
  }
}
