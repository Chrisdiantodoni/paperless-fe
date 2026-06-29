import { readSessionToken } from "@/server/session"
import { setupApi } from "@workspace/api-client"

// Pastikan ada string kosong atau fallback jika env tidak terdefinisi
const baseUrl = import.meta.env.VITE_BASE_URL || "/api"
const portalUrl = import.meta.env.VITE_PORTAL_URL || ""

export const api = setupApi(baseUrl, portalUrl, () => readSessionToken())
