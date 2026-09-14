export interface IDashboardData {
  inbox: {
    urgent: number
    approved: number
    revision_and_rejected: number
  }
  outbox: {
    draft: number
  }
}

export interface IDashboardResponse {
  meta: {
    code: number
    status: string
    message: string
  }
  data: IDashboardData
}
