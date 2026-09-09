export function extractApiError(error: any): {
  message: string
  details?: Record<string, string[]>
  statusCode?: number
} {
  console.error("🔍 Full error object:", {
    status: error?.status,
    code: error?.code,
    message: error?.message,
    errors: error?.errors,
    errorMessage: error?.errorMessage,
    responseData: error?.responseData,
    meta: error?.meta,
  })

  const statusCode = error?.status

  if (error?.message) {
    return {
      message: error.message,
      details: error?.errors,
      statusCode,
    }
  }

  if (error?.errors && typeof error.errors === "object") {
    const firstField = Object.keys(error.errors)[0]
    const firstError = error.errors[firstField]?.[0]

    return {
      message: firstError || "Validation error",
      details: error.errors,
      statusCode,
    }
  }

  if (error?.errorMessage) {
    return {
      message:
        typeof error.errorMessage === "string"
          ? error.errorMessage
          : JSON.stringify(error.errorMessage),
      statusCode,
    }
  }

  return {
    message: "Terjadi kesalahan",
    statusCode,
  }
}
