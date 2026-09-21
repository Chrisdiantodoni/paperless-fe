export function formatPermissionPart(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function groupPermissions(names: string[]) {
  return Object.entries(
    names.reduce<Record<string, string[]>>((groups, name) => {
      const separator = name.indexOf(".")
      const group = separator === -1 ? name : name.slice(0, separator)
      ;(groups[group] ??= []).push(name)
      return groups
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b))
}

export function permissionLabel(name: string) {
  const separator = name.indexOf(".")
  return formatPermissionPart(
    separator === -1 ? name : name.slice(separator + 1)
  )
}
