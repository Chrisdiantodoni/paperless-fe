import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import type { UserData } from "@workspace/types/user.type"
import { SidebarProvider } from "@workspace/ui/components/ui/sidebar"
import { TooltipProvider } from "@workspace/ui/components/ui/tooltip"
import { Toaster } from "@workspace/ui/components/ui/sonner"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import appCss from "@/index.css?url"
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { ConfirmProvider } from "@workspace/ui/components/ui/confirm-dialog"

interface RouteContext {
  user?: UserData
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouteContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Paperless User Top Agent",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <QueryClientProvider client={queryClient}>
            <ConfirmProvider>
              <SidebarProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </SidebarProvider>

              <Toaster />
            </ConfirmProvider>
            <TanStackDevtools
              config={{ position: "bottom-right" }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: "Tanstack Form",
                  render: <FormDevtoolsPanel />,
                },
                {
                  name: "Tanstack Query",
                  render: <ReactQueryDevtoolsPanel />,
                },
              ]}
            />
          </QueryClientProvider>
        </ThemeProvider>

        <Scripts />
      </body>
    </html>
  )
}
