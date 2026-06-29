import { createApi } from "./api"
import { setupInterceptors } from "./interceptors"

const setupApi = (
  baseUrl: string,
  portalUrl?: string,
  getToken?: () => string | null
) => {
  const api = createApi(baseUrl)
  setupInterceptors(api, portalUrl, getToken)
  return api
}

export { setupApi }
