import { createIsomorphicFn } from "@tanstack/react-start"
import Cookies from "js-cookie"
import { SESSION_COOKIE } from "@workspace/utils"

export const readSessionToken = createIsomorphicFn()
  .server(async () => {
    const { readSessionTokenServer } = await import("./session.server")
    return readSessionTokenServer()
  })
  .client(() => {
    return Cookies.get(SESSION_COOKIE) ?? null
  })
