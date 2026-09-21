import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import type { UserData } from "@workspace/types/user.type"
import { TooltipProvider } from "@workspace/ui/components/ui/tooltip"
import { Toaster } from "@workspace/ui/components/ui/sonner"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import appCss from "@/index.css?url"
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { ConfirmProvider } from "@workspace/ui/components/ui/confirm-dialog"
import { SidebarProvider } from "@workspace/ui/components/ui/sidebar"

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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-5 text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="text-muted-foreground">
          Alamat mungkin salah atau halaman sudah dipindahkan.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ke dashboard
          </Link>
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm font-medium"
            onClick={() => window.history.back()}
          >
            Kembali
          </button>
        </div>
      </div>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()
  return (
    <html lang="id" suppressHydrationWarning>
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
