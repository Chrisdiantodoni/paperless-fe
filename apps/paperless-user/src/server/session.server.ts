// src/server/session.ts
import {
  getRequestHeader,
  setResponseHeader,
} from "@tanstack/react-start/server"
import { SESSION_COOKIE } from "@workspace/utils"

const ONE_DAY = 60 * 60 * 24

const secureFlag = import.meta.env.PROD ? "Secure" : ""

export function setSessionCookie(token: string) {
  setResponseHeader(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      `HttpOnly`,
      ...(secureFlag ? [secureFlag] : []),
      `SameSite=Lax`,
      `Path=/`,
      `Max-Age=${ONE_DAY}`,
    ].join("; ")
  )
}

export function clearSessionCookieServer() {
  setResponseHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; ${secureFlag ? `${secureFlag}; ` : ""}SameSite=Lax; Path=/; Max-Age=0`
  )
}

export function readSessionTokenServer(): string | null {
  const header = getRequestHeader("cookie")
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    // Split only on the FIRST '=' — signed/base64 values often contain '='.
    const eq = part.indexOf("=")
    if (eq === -1) continue
    if (part.slice(0, eq) === SESSION_COOKIE) return part.slice(eq + 1)
  }
  return null
}
