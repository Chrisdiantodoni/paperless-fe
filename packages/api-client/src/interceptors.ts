import type { AxiosInstance } from "axios"
import Cookies from "js-cookie"
import { SESSION_COOKIE } from "@workspace/utils"

export const setupInterceptors = (
  instance: AxiosInstance,
  portalUrl?: string,
  getToken?: () => string | null | Promise<string | null>
) => {
  const isClient = typeof window !== "undefined"

  instance.interceptors.request.use(
    async (config) => {
      // await supaya handle baik sync (client) maupun async (server)
      const token = (await getToken?.()) ?? Cookies.get(SESSION_COOKIE)
      console.log({ token })
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status
      const responseData = error?.response?.data

      const message = responseData?.message
      const code = responseData?.code

      // ==========================================================
      // JIKA DI SERVER: Jangan diam diam reject, beri tahu "Arah Redirect" nya
      // ==========================================================
      if (!isClient) {
        let redirectTo: string | null = null

        if (
          status === 403 &&
          (code === "MUST_CHANGE_PASSWORD" ||
            message?.includes("MUST_CHANGE_PASSWORD"))
        ) {
          // redirectTo = `${portalUrl}/portal`
        } else if (status === 403) {
          redirectTo = "/403"
        } else if (status === 401 || message === "Unauthenticated.") {
          // redirectTo = `${portalUrl}/portal`
        } else if (status === 503) {
          redirectTo = "/under-construction"
        }

        // Lemparkan error objek yang membawa info `redirectTo`
        return Promise.reject({
          status,
          code,
          message,
          redirectTo, // <--- Aplikasi di atas tinggal baca property ini
          originalError: error,
        })
      }

      // ==========================================================
      // JIKA DI CLIENT: Pakai window seperti biasa + trick menggantung request
      // ==========================================================
      if (
        status === 403 &&
        (code === "MUST_CHANGE_PASSWORD" ||
          message?.includes("MUST_CHANGE_PASSWORD"))
      ) {
        if (portalUrl && !window.location.href.startsWith(portalUrl)) {
          window.location.href = `${portalUrl}/portal`
          return new Promise(() => {})
        }
      }

      if (status === 403) {
        window.location.href = "/403"
        return new Promise(() => {})
      } else if (status === 401 || message === "Unauthenticated.") {
        if (window.location.pathname !== "/login") {
          // Cookies.remove(SESSION_COOKIE)
          // window.location.href = `${portalUrl}/portal`
          return new Promise(() => {})
        }
      } else if (status === 503) {
        window.location.href = "/under-construction"
        return new Promise(() => {})
      }

      return Promise.reject({
        status,
        code,
        message,
        originalError: error,
      })
    }
  )
}
