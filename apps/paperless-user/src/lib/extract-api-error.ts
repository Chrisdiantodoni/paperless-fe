/**
 * Extract readable error message dari Laravel API response
 * Mendukung berbagai format error Laravel (validation, exception, generic)
 */
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
  })

  const statusCode = error?.status

  // Format 1: Direct errors from interceptor (validation errors)
  if (error?.errors && typeof error.errors === "object") {
    const firstField = Object.keys(error.errors)[0]
    const firstError = error.errors[firstField]?.[0]

    return {
      message: error?.message || firstError || "Validation error",
      details: error.errors,
      statusCode,
    }
  }

  // Format 2: Direct message from interceptor
  if (error?.message) {
    return {
      message: error.message,
      statusCode,
    }
  }

  // Format 3: errorMessage from interceptor (generic Laravel error field)
  if (error?.errorMessage) {
    return {
      message:
        typeof error.errorMessage === "string"
          ? error.errorMessage
          : JSON.stringify(error.errorMessage),
      statusCode,
    }
  }

  // Format 4: Fallback to old format (if error.response still exists)
  const response = error?.response
  const data = response?.data

  if (!response && !statusCode) {
    return {
      message: "Network error - tidak dapat terhubung ke server",
      statusCode: 0,
    }
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstField = Object.keys(data.errors)[0]
    const firstError = data.errors[firstField]?.[0]

    return {
      message: data?.message || firstError || "Validation error",
      details: data.errors,
      statusCode: statusCode || response?.status,
    }
  }

  if (data?.message) {
    return {
      message: data.message,
      statusCode: statusCode || response?.status,
    }
  }

  if (data?.error) {
    return {
      message:
        typeof data.error === "string" ? data.error : JSON.stringify(data.error),
      statusCode: statusCode || response?.status,
    }
  }

  if (typeof data === "string") {
    return {
      message: data,
      statusCode: statusCode || response?.status,
    }
  }

  const statusText = response?.statusText
  return {
    message: `Request failed: ${statusCode || response?.status || "Unknown"} ${statusText || ""}`,
    statusCode: statusCode || response?.status,
  }
}
