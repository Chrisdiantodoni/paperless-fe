import { getArea } from "@/server/master"
import { useQuery } from "@tanstack/react-query"

export function useAreas() {
  return useQuery({
    queryKey: ["master", "areas"],
    queryFn: () => getArea(),
    staleTime: 5 * 60 * 1000,
  })
}
