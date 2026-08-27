import { Fragment } from "react"
import { Link, useMatches } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/ui/breadcrumb"
import { buildBreadcrumbMap, humanizeSegment } from "@/lib/breadcrumb"
import type { NavPrimaryprops } from "@workspace/types/utilities"

/**
 * Konvensi opsional: route boleh mengembalikan field `breadcrumb`
 * dari loader-nya untuk override label breadcrumb pada path tersebut.
 * Berguna untuk dynamic route (mis. /users/$userId) yang ingin
 * menampilkan nama asli (mis. "John Doe"), bukan ID mentah.
 *
 * Contoh di route:
 *   loader: async ({ params }) => {
 *     const user = await fetchUser(params.userId)
 *     return { user, breadcrumb: user.name }
 *   }
 */
type LoaderWithBreadcrumb = { breadcrumb?: string }

export function DynamicBreadcrumb({
  sidebar,
}: {
  sidebar: NavPrimaryprops["items"]
}) {
  const matches = useMatches()
  const breadcrumbMap = buildBreadcrumbMap(sidebar)

  // Dedup by pathname: route layout (mis. /dashboard/route.tsx) dan route index
  // (/dashboard/index.tsx) sama-sama menghasilkan match dengan pathname "/dashboard".
  // Kita pakai Map supaya tiap pathname unik hanya muncul sekali di breadcrumb,
  // dengan match TERAKHIR yang menang (biasanya match leaf/index, yang loaderData-nya
  // paling relevan untuk override breadcrumb).
  const crumbMap = new Map<string, string>()

  for (const match of matches) {
    // Normalisasi: hapus trailing slash supaya "/dashboard" dan "/dashboard/"
    // (mis. dari route index) dianggap pathname yang sama.
    const normalizedPath =
      match.pathname.length > 1 && match.pathname.endsWith("/")
        ? match.pathname.slice(0, -1)
        : match.pathname

    // root match biasanya pathname "/" atau id "__root__", tidak relevan untuk breadcrumb
    if (normalizedPath === "/" || match.id.includes("__root__")) continue

    const loaderData = match.loaderData as LoaderWithBreadcrumb | undefined
    const segments = normalizedPath.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1] ?? ""

    const label =
      loaderData?.breadcrumb ?? // 1. override eksplisit dari loader route (opsional)
      breadcrumbMap.get(normalizedPath) ?? // 2. otomatis dari data sidebar
      humanizeSegment(lastSegment) // 3. fallback dari segmen URL

    crumbMap.set(normalizedPath, label)
  }

  const crumbs = Array.from(crumbMap.entries()).map(([path, label]) => ({
    path,
    label,
  }))

  if (crumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <Fragment key={crumb.path}>
              <BreadcrumbItem
                className={!isLast ? "hidden md:block" : undefined}
              >
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
