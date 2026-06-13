import axios from "axios"

export const createApi = (baseURL: string) => {
  return axios.create({
    baseURL,
  })
}
