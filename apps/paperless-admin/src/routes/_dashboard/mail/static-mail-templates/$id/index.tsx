import StaticMailTemplateDetail from "@/components/detail/static-template-detail"
import { useDeleteStaticMailMutation } from "@/hooks/queries/use-static-mail-template"
import { getStaticMailTemplateById } from "@/server/master"
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { ArrowLeft, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"

export const Route = createFileRoute(
  "/_dashboard/mail/static-mail-templates/$id/"
)({
  loader: async ({ params }) => {
    const id = params.id
    const data = await getStaticMailTemplateById({ data: id })
    return { data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  const { mutateAsync: deleteMutate } = useDeleteStaticMailMutation()

  const router = useRouter()

  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleDelete = async () => {
    await confirm({
      title: "Hapus template?",
      description: `Template "${data.name}" akan dihapus permanen.`,
      variant: "destructive",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        try {
          await deleteMutate(data.id)
          toast.success("Template berhasil dihapus")
          navigate({
            to: "/mail/static-mail-templates",
            search: {
              page: 1,
              search: "",
              per_page: 10,
              branch: "",
              branch_label: "",
              department: "",
              department_label: "",
              position: "",
              position_label: "",
              is_active: "",
            },
          })
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Gagal menghapus template"
          )
          throw error
        }
      },
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Kembali
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
            Hapus
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              to="/mail/static-mail-templates/$id/edit"
              params={{ id: data.id }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
      <StaticMailTemplateDetail data={data} />
    </div>
  )
}
