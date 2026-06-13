import type { AxiosInstance } from "axios"
import Cookies from "js-cookie"

export const setupInterceptors = (
  instance: AxiosInstance,
  portalUrl?: string
) => {
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token")

      if (token) {
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

      if (
        status === 403 &&
        (code === "MUST_CHANGE_PASSWORD" ||
          message?.includes("MUST_CHANGE_PASSWORD"))
      ) {
        if (portalUrl && !window.location.href.startsWith(portalUrl)) {
          window.location.href = `${portalUrl}/portal`

          return new Promise(() => {})
        }

        return Promise.reject({
          status,
          code,
          message,
          originalError: error,
        })
      }

      if (status === 403) {
        window.location.href = "/403"
      } else if (status === 401 || message === "Unauthenticated.") {
        if (window.location.pathname !== "/login") {
          Cookies.remove("token")
          localStorage.clear()
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

// export const createApiClient = (baseURL: string, portalUrl?: string) => {
//   const instance = axios.create({
//     baseURL,
//   })

//
//   )

//   return instance
// }
