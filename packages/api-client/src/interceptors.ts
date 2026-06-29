import type { AxiosInstance } from "axios"
import Cookies from "js-cookie"

export const setupInterceptors = (
  instance: AxiosInstance,
  portalUrl?: string,
  getToken?: () => string
) => {
  const isClient = typeof window !== "undefined"

  instance.interceptors.request.use(
    (config) => {
      let token: string | null = null

      if (isClient) {
        // Jika di browser, baca lewat js-cookie biasa
        token = Cookies.get("token") || null
      } else if (getToken) {
        // Jika di server, jalankan fungsi penarik cookie yang dikirim dari apps
        token = getToken()
      }

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

      // JIKA BERJALAN DI SERVER (createServerFn), hentikan manipulasi window.location
      if (!isClient) {
        return Promise.reject({
          status,
          code,
          message,
          originalError: error,
        })
      }

      // ── LOGIKA KHUSUS CLIENT BROWSER (Aman menggunakan window & localStorage) ──
      if (
        status === 403 &&
        (code === "MUST_CHANGE_PASSWORD" ||
          message?.includes("MUST_CHANGE_PASSWORD"))
      ) {
        if (portalUrl && !window.location.href.startsWith(portalUrl)) {
          window.location.href = `${portalUrl}/portal`
          return new Promise(() => {}) // gantung request agar tidak render UI rusak
        }
      }

      if (status === 403) {
        window.location.href = "/403"
      } else if (status === 401 || message === "Unauthenticated.") {
        if (window.location.pathname !== "/login") {
          Cookies.remove("token")
          localStorage.clear() // Sekarang aman, tidak bikin Node.js crash lagi
          window.location.href = "/login"
        }
      } else if (status === 503) {
        window.location.href = "/under-construction"
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
