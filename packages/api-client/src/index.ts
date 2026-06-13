import { createApi } from "./api"
import { setupInterceptors } from "./interceptors"

const setupApi = (baseUrl: string, portalUrl?: string) => {
  const api = createApi(baseUrl)
  setupInterceptors(api, portalUrl)
  return api
}

export { setupApi }
