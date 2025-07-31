import type { MiddlewareFactory } from "./stackMiddlewares"
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest
} from "next/server"
import acceptLanguage from "accept-language"
import { fallbackLng, languages } from "@/i18n/settings"
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"

acceptLanguage.languages(languages)

export const withLocaleRedirection: MiddlewareFactory = (
  next: NextMiddleware
) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const cookieName = "i18next"
    const res = await next(req, _next)

    // TODO: find a better way to exclude images and assets from being redirected
    // TODO: looks like this regex is non-functional. Check out the regex in withDowntimeHandler.ts
    if (
      req.nextUrl.pathname.match(
        "/((?!api|_next/static|auth|protected|_next/image|assets|favicon.ico|sw.js|robots.txt).*)"
      ) != null
    ) {
      let lng: string | null = ""
      if (req.cookies.has(cookieName)) {
        lng = acceptLanguage.get(
          (req.cookies.get(cookieName) as RequestCookie).value
        )
      }
      if (lng !== null) {
        lng = acceptLanguage.get(req.headers.get("Accept-Language"))
      }
      if (lng !== null) {
        lng = fallbackLng
      }

      // Redirect if lng in path is supported
      if (
        !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith("/_next") &&
        !req.nextUrl.pathname.endsWith(".svg") &&
        !req.nextUrl.pathname.endsWith(".jpg") &&
        !req.nextUrl.pathname.endsWith(".png") &&
        !req.nextUrl.pathname.includes("/maintenance/api")
      ) {
        return NextResponse.redirect(
          new URL(`/${lng as string}${req.nextUrl.pathname}`, req.url)
        )
      }

      if (req.headers.has("referer")) {
        const refererUrl = new URL(req.headers.get("referer") as string)
        const lngInReferer = languages.find(l =>
          refererUrl.pathname.startsWith(`/${l}`)
        )
        const response = NextResponse.next()
        if (typeof lngInReferer !== "undefined") {
          response.cookies.set(cookieName, lngInReferer)
        }
        return response
      }

      return NextResponse.next()
    }

    return res
  }
}
