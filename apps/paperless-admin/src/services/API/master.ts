import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import type {
  Area,
  Branch,
  Department,
  Position,
} from "@workspace/types/master"
import { api } from "../api"

class MasterService {
  async getArea(): Promise<APIResponse<LaravelPaginationData<Area[]>>> {
    try {
      const res = await api.get("/master/areas")
      return res.data
    } catch (error: any) {
      console.error("Error di get area:", error)
      throw error
    }
  }

  async getBranches(): Promise<APIResponse<LaravelPaginationData<Branch[]>>> {
    try {
      const res = await api.get("/master/branches")
      return res.data
    } catch (error: any) {
      console.error("Error di get branches:", error)
      throw error
    }
  }

  async getDepartments(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<Department[]>>> {
    try {
      console.log(params)
      const res = await api.get("/master/departments", { params })
      return res.data
    } catch (error: any) {
      console.error("Error di get departments:", error)
      throw error
    }
  }

  async getPositions(): Promise<
    APIResponse<LaravelPaginationData<Position[]>>
  > {
    try {
      const res = await api.get("/master/positions")
      return res.data
    } catch (error: any) {
      console.error("Error di get branches:", error)
      throw error
    }
  }
}

export default new MasterService()
