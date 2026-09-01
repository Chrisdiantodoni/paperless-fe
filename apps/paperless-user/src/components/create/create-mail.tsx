import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import { useAppForm } from "@workspace/forms/src/forms"
import { Field, FieldGroup } from "@workspace/ui/components/ui/field"
import { Label } from "@workspace/ui/components/ui/label"
import { Plus } from "lucide-react"
import { createMailTemplateSchema } from "@/schema/mail/create-mail.schema"
import { DepartmentCombobox } from "../select/select-departments"
import { StaticTemplateCombobox } from "../select/select-static-template"
import { DynamicTemplateCombobox } from "../select/select-dynamic-template"
import type { SelectValue } from "@workspace/types"
import { useStore } from "@tanstack/react-form"
import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"

const options = [
  {
    value: "dynamic",
    label: "Dynamic Template",
  },
  {
    value: "leave_request",
    label: "Cuti",
  },
  {
    value: "permit_request",
    label: "Izin",
  },
  {
    value: "overtime_request",
    label: "Lembur",
  },
  {
    value: "absence_request",
    label: "Absensi",
  },
]

export default function CreateMail() {
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      request_type: "",
      department: { value: "", label: "" },
      template: { value: "", label: "" },
    },
    validators: {
      onSubmit: createMailTemplateSchema,
    },
    onSubmit: async ({ value }) => {
      navigate({
        to: "/mail/user-mails/create",
        search: {
          request_type: value.request_type,
          department: value.department,
          template: value.template,
        },
      })
    },
  })

  const formType = useStore(form.store, (state) => state.values.request_type)
  const departmentValue = useStore(
    form.store,
    (state) => state.values.department
  )

  // Reset template when department or request_type changes
  useEffect(() => {
    form.setFieldValue("template", { value: "", label: "" })
  }, [formType, departmentValue])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Buat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit(e)
          }}
        >
          <DialogHeader>
            <DialogTitle>Buat Mail</DialogTitle>
            <DialogDescription>
              Pilih Departemen dan Template untuk pembuatan mail.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-2 py-4">
            <Field>
              <form.AppField name="request_type">
                {(field) => (
                  <field.SelectField
                    label="Pilih Request"
                    options={options}
                    placeholder="Pilih Request"
                  />
                )}
              </form.AppField>
            </Field>

            <form.Field name="department">
              {(field) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0
                return (
                  <div className="flex w-full flex-col space-y-1.5">
                    <Label required>Kategori / Dept</Label>
                    <DepartmentCombobox
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      invalid={showError}
                      error={
                        showError ? String(errors[0]?.message ?? "") : undefined
                      }
                    />
                  </div>
                )
              }}
            </form.Field>

            {formType && (
              <form.Field name="template">
                {(field) => {
                  const errors = field.state.meta.errors
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  const departmentValue = form.getFieldValue("department")
                  const departmentId =
                    typeof departmentValue === "object" && departmentValue.value
                      ? departmentValue.value
                      : ""

                  // Hide template field if department not selected yet
                  if (!departmentId) {
                    return null
                  }

                  return (
                    <div className="mt-1 flex w-full flex-col space-y-1.5">
                      <Label required>Template</Label>
                      {formType === "dynamic" ? (
                        <DynamicTemplateCombobox
                          value={field.state.value}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                          departmentId={departmentId}
                          invalid={showError}
                          error={
                            showError
                              ? String(errors[0]?.message ?? "")
                              : undefined
                          }
                        />
                      ) : (
                        <StaticTemplateCombobox
                          value={field.state.value as SelectValue}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                          departmentId={departmentId}
                          invalid={showError}
                          error={
                            showError
                              ? String(errors[0]?.message ?? "")
                              : undefined
                          }
                        />
                      )}
                    </div>
                  )
                }}
              </form.Field>
            )}
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton label="Buat" type="submit" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
