// server.ts (root)
import express from "express"
import { toNodeHandler } from "srvx/node"

// Detect environment
const DEVELOPMENT = process.env.NODE_ENV === "development"
const PORT = Number.parseInt(process.env.PORT || "3000")

// Create express app
const app = express()

if (DEVELOPMENT) {
  // Vite is imported dynamically only when DEVELOPMENT is true.
  // That avoids bundling or requiring Vite in production, since we don’t need it there.
  const vite = await import("vite")

  // Create vite server in middleware mode
  // See: https://vite.dev/config/server-options.html#server-middlewaremode
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },

    // Disable Vite's own HTML serving logic.
    // This allows your custom Express server to control routing and SSR.
    // See: https://vite.dev/guide/ssr.html#setting-up-the-dev-server
    appType: "custom",
  })

  // Use vite's connect instance as middleware for express
  // This enables Vite to intercept requests, compile modules on the fly,
  // and provide HMR (Hot Module Replacement) in development.
  // See: https://vite.dev/guide/ssr.html#setting-up-the-dev-server
  app.use(viteDevServer.middlewares)

  app.use(async (req, res, next) => {
    try {
      // Dynamically load the SSR server entry on each request.
      // This allows hot reload of server code in development.
      const { default: serverEntry } =
        await viteDevServer.ssrLoadModule("./src/server.ts")

      // Convert TanStack Start's fetch-style handler to an Express handler.
      const handler = toNodeHandler(serverEntry.fetch)

      // Handle the request with the SSR handler
      await handler(req, res)
    } catch (error) {
      // Fix stack traces so Vite points to original source code
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error)
      }
      next(error)
    }
  })
} else {
  // Import the prebuilt SSR handler from the production build.
  const { default: handler } = await import("./dist/server/server.js")

  // Convert TanStack Start's fetch-style handler to an Express handler.
  const nodeHandler = toNodeHandler(handler.fetch)

  // Serve static assets (JS, CSS, images) from the built client directory.
  app.use(express.static("dist/client"))

  // Handle all other requests via SSR.
  // Any request not matched by static assets will be rendered
  // using the TanStack Start server handler.
  app.use(async (req, res, next) => {
    try {
      await nodeHandler(req, res)
    } catch (error) {
      next(error)
    }
  })
}

// Boot server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
