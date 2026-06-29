import { createCsrfMiddleware, createStart } from "@tanstack/react-start"

// 1. Buat filter middleware CSRF khusus untuk server functions
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [csrfMiddleware],
  }
})
