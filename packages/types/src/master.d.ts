export interface NavPrimaryprops {
  items: {
    title: string
    to: string
    icon: LucideIcon
    activeOptions?: { exact: boolean }
  }[]
}

export interface NavUserProps {
  user: User
}
