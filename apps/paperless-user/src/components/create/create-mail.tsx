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
import { Select } from "@workspace/ui/components/ui/select"
import { Plus } from "lucide-react"
import {
  createMailTemplateSchema,
  sendMailSchema,
} from "@/schema/mail/create-mail.schema"
import { DepartmentCombobox } from "../select/select-departments"
import type { SelectValue } from "@workspace/types"
import { useStore } from "@tanstack/react-form"

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
  const form = useAppForm({
    defaultValues: {
      request_type: "",
      department: { value: "", label: "" },
      template: { value: "", label: "" },
    },
    validators: {
      onSubmit: createMailTemplateSchema,
    },
    onSubmit: async (data) => {
      console.log({ data })
    },
  })

  const formType = useStore(form.store, (state) => state.values.request_type)

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
          <FieldGroup>
            <Field>
              <form.AppField name="request_type">
                {(field: any) => (
                  <field.SelectField
                    label="Pilih Request"
                    options={options}
                    placeholder="Pilih Request"
                  />
                )}
              </form.AppField>
            </Field>

            <form.Field name="department">
              {(field: any) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0
                return (
                  <div className="flex w-full flex-col space-y-2">
                    <Label required>Kategori / Dept</Label>
                    <div className="flex w-full flex-col">
                      <DepartmentCombobox
                        value={field.state.value as SelectValue}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        invalid={showError}
                        error={
                          showError
                            ? String(errors[0].message ?? "")
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )
              }}
            </form.Field>
          </FieldGroup>
          {formType === "dynamic" ? <div>Dynamic</div> : null}
          <DialogFooter>
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
