import type { ErrorAPI, ErrorApiTypes } from "./api"
import type {
  ObligatedTemplate,
  ObligatedTemplateListParams,
  ObligatedTemplateListResponse,
} from "./mail"

export type { ErrorAPI, ErrorApiTypes }
export type {
  ObligatedTemplate,
  ObligatedTemplateListParams,
  ObligatedTemplateListResponse,
}

export * from "./master"
export * from "./dashboard"
export * from "./admin"
export type SelectValue = { value: string; label: string }
