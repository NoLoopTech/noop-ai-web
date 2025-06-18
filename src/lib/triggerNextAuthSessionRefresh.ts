/**
 * Triggers a session refresh on all open tabs
 * INFO: exploits an undocumented feature of next-auth. Refer node_modules/next-auth/src/client/_utils.ts
 * WARN: MIGHT NOT WORK FOR FUTURE VERSIONS! Works with v4.24.11 so far
 */

export default function triggerNextAuthSessionRefresh(): void {
  localStorage.setItem(
    "nextauth.message",
    `{"event":"session","data":{"trigger":"getSession"},"timestamp":${Math.floor(
      Date.now() / 1000
    )}}`
  )
}
