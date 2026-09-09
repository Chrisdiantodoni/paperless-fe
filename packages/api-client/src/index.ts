import { createApi } from "./api"
import { setupInterceptors } from "./interceptors"
import { extractApiError } from "./utils"

const setupApi = (
  baseUrl: string,
  portalUrl?: string,
  getToken?: () => string | null | Promise<string | null>
) => {
  const api = createApi(baseUrl)
  setupInterceptors(api, portalUrl, getToken)
  return api
}

export { setupApi, extractApiError }
