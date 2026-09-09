export const SESSION_COOKIE = "paperless-session"

export function clearSessionCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
  }
}
