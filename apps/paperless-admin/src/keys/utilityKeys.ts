export const utilityKeys = {
  all: ["utilities"] as const,
  sidebar: () => [...utilityKeys.all, "sidebar"] as const,
}
