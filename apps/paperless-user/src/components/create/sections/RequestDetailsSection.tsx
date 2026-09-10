import { ClipboardList } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LeaveRequestForm } from "@/components/create/leave-request-form"
import { PermitRequestForm } from "@/components/create/permit-request-form"
import { AbsenceRequestForm } from "@/components/create/absence-request-form"
import { OvertimeRequestForm } from "@/components/create/overtime-request-form"
import { DynamicFormRenderer } from "@/components/create/dynamic-form-renderer"
import type { IDynamicMailTemplate } from "@workspace/types"

export interface MailRequestTemplateShape {
  content?: string
  form_schema?: string | unknown[]
}

export interface RequestDetailsSectionProps {
  form: any
  requestType: string
  template?: IDynamicMailTemplate | MailRequestTemplateShape
}

export function RequestDetailsSection({
  form,
  requestType,
  template,
}: RequestDetailsSectionProps) {
  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "leave_request":
        return "Detail Cuti"
      case "permit_request":
        return "Detail Izin"
      case "absence_request":
        return "Detail Ketidakhadiran"
      case "overtime_request":
        return "Detail Lembur"
      case "dynamic":
        return "Detail Memo Internal"
      case "dynamic_template":
        return "Detail Memo Internal"
      default:
        return "Detail"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">
            {getRequestTypeLabel(requestType)}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {requestType === "leave_request" && <LeaveRequestForm form={form} />}
        {requestType === "permit_request" && <PermitRequestForm form={form} />}
        {requestType === "absence_request" && (
          <AbsenceRequestForm form={form} />
        )}
        {requestType === "overtime_request" && (
          <OvertimeRequestForm form={form} />
        )}
        {requestType === "dynamic_template" && (
          <DynamicFormRenderer form={form} template={template!} />
        )}
      </CardContent>
    </Card>
  )
}
