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
export type SelectValue = { value: string; label: string }
