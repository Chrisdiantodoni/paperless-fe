import { UserData } from "./user.type"

export interface NavPrimaryprops {
  items: {
    header?: string
    title?: string
    icon?: string
    url?: string
    permission?: null | string
    children?: Child[]
    activeOptions?: { exact: boolean }
  }[]
}

export interface NavUserProps {
  user: UserData
}
export interface Child {
  title: string
  url: string
  permission: string
  activeOptions?: { exact: boolean }
}
