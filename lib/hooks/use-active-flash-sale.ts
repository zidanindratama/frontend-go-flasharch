import { useQuery } from "@tanstack/react-query";
import { getActiveFlashSale } from "@/lib/api/flash-sale";

export function useActiveFlashSale() {
  return useQuery({
    queryKey: ["public.flashSale"],
    queryFn: async () => {
      const res = await getActiveFlashSale();
      return res.data.data;
    },
    staleTime: 30_000,
  });
}
