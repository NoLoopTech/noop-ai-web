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

    // INFO: Detect language preference: cookie -> Accept-Language header -> fallback
    let lng: string | null = null
    if (req.cookies.has(cookieName)) {
      lng = acceptLanguage.get(
        (req.cookies.get(cookieName) as RequestCookie).value
      )
    }

    if (!lng) {
      lng = acceptLanguage.get(req.headers.get("accept-language") || "")
    }

    if (!lng) {
      lng = fallbackLng
    }

    // INFO: If user visits the root path, redirect to the detected language admin page
    if (req.nextUrl.pathname === "/") {
      // INFO: preserve any search/query string when redirecting
      return NextResponse.redirect(
        new URL(`/${lng}/admin${req.nextUrl.search || ""}`, req.url)
      )
    }

    // INFO: If user visits a locale root like `/en` or `/en/`, redirect to that locale's admin
    const firstSegment = req.nextUrl.pathname.split("/").filter(Boolean)[0]
    if (
      firstSegment &&
      languages.includes(firstSegment) &&
      req.nextUrl.pathname.replace(/\/$/, "").split("/").filter(Boolean)
        .length === 1
    ) {
      return NextResponse.redirect(
        new URL(`/${firstSegment}/admin${req.nextUrl.search || ""}`, req.url)
      )
    }

    // TODO: find a better way to exclude images and assets from being redirected
    // TODO: looks like this regex is non-functional. Check out the regex in withDowntimeHandler.ts
    if (
      req.nextUrl.pathname.match(
        "/((?!api|_next/static|auth|protected|_next/image|assets|favicon.ico|sw.js|robots.txt).*)"
      ) != null
    ) {
      let detectedLng: string | null = null
      if (req.cookies.has(cookieName)) {
        detectedLng = acceptLanguage.get(
          (req.cookies.get(cookieName) as RequestCookie).value
        )
      }
      if (!detectedLng) {
        detectedLng = acceptLanguage.get(
          req.headers.get("accept-language") || ""
        )
      }
      if (!detectedLng) {
        detectedLng = fallbackLng
      }
      const lngToUse = detectedLng

      // Redirect if lng in path is supported
      if (
        !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith("/_next") &&
        !req.nextUrl.pathname.startsWith("/data") &&
        !req.nextUrl.pathname.endsWith(".svg") &&
        !req.nextUrl.pathname.endsWith(".jpg") &&
        !req.nextUrl.pathname.endsWith(".png") &&
        !req.nextUrl.pathname.endsWith(".geojson") &&
        !req.nextUrl.pathname.includes("/maintenance/api")
      ) {
        // INFO: preserve any search/query string when redirecting to the localized path
        return NextResponse.redirect(
          new URL(
            `${"/" + (lngToUse as string)}${req.nextUrl.pathname}${req.nextUrl.search || ""}`,
            req.url
          )
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
