import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import type {
  Area,
  Branch,
  Department,
  IStaff,
  Position,
  StaticMailTemplate,
} from "@workspace/types/master"
import { api } from "../api"
import type { StaticMailTemplateFormSchema } from "@/schema/master/schema"

class MasterService {
  async getArea(): Promise<APIResponse<LaravelPaginationData<Area[]>>> {
    const res = await api.get("/master/areas")
    return res.data
  }

  async getBranches(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<Branch[]>>> {
    const res = await api.get("/master/branches", { params })
    return res.data
  }

  async getDepartments(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<Department[]>>> {
    const res = await api.get("/master/departments", { params })
    return res.data
  }

  async getPositions(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<Position[]>>> {
    const res = await api.get("/master/positions", { params })
    return res.data
  }

  async getStaff(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<IStaff[]>>> {
    console.log(params)
    const res = await api.get("/master/staffs", { params })
    return res.data
  }

  async getStaticMailTemplates(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<StaticMailTemplate[]>>> {
    const res = await api.get("/mail/static/static-mail-templates", { params })
    return res.data
  }

  async getStaticMailTemplateById(
    id: string
  ): Promise<APIResponse<LaravelPaginationData<StaticMailTemplate[]>>> {
    const res = await api.get(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }

  async createStaticMailTemplate(data: any): Promise<APIResponse<any>> {
    const res = await api.post("/mail/static/static-mail-templates", data)
    return res.data
  }

  async updateStaticMailTemplate(
    id: string,
    data: StaticMailTemplateFormSchema
  ): Promise<APIResponse<any>> {
    const res = await api.put(`/mail/static/static-mail-templates/${id}`, data)
    return res.data
  }

  async deleteStaticMailTemplate(id: string): Promise<APIResponse<any>> {
    const res = await api.delete(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }
}

export default new MasterService()
