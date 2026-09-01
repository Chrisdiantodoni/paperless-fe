import DynamicTemplateDetail from "@/components/detail/dynamic-template-detail"
import { useDeleteDynamicMailTemplateMutation } from "@/hooks/queries/use-dynamic-mail-template"
import { getDynamicMailTemplateById } from "@/server/master"
import {
  createFileRoute,
  useRouter,
  Link,
  useNavigate,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { ArrowLeft, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"

export const Route = createFileRoute(
  "/_dashboard/mail/dynamic-mail-templates/$id/"
)({
  loader: async ({ params }) => {
    const id = params.id
    const data = await getDynamicMailTemplateById({ data: id })
    return { data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { data } = Route.useLoaderData()
  const { mutateAsync: deleteMutate } = useDeleteDynamicMailTemplateMutation()

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
            to: "/mail/dynamic-mail-templates",
            search: {
              page: 1,
              search: "",
              per_page: 10,
              branch_id: "",
              branch_label: "",
              department_id: "",
              department_label: "",
              position_id: "",
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
              to="/mail/dynamic-mail-templates/$id/edit"
              params={{ id: data.id }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
      <DynamicTemplateDetail data={data} />
    </div>
  )
}
