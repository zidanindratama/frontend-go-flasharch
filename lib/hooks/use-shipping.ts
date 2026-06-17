"use client"

import { useQuery } from "@tanstack/react-query"
import { getShippingCost, type ShippingCostParams } from "@/lib/api/shipping-region"
import { useAuthStore } from "@/stores/auth"

export type ShippingOption = {
  courier_code: string
  courier_name: string
  service_name: string
  price: number
  weight: number
  estimation: string | null
}

type ShippingCostApiResponse = {
  is_success: boolean
  message: string
  data: {
    origin_village_code: string
    destination_village_code: string
    weight: number
    couriers: ShippingOption[]
  }
}

export function useShippingCost(destinationVillageCode: string | null, weight: number) {
  const token = useAuthStore((s) => s.access_token)

  return useQuery({
    queryKey: ["shipping.cost", destinationVillageCode, weight],
    queryFn: async () => {
      const response = await getShippingCost<ShippingCostApiResponse>({
        destination_village_code: destinationVillageCode!,
        weight,
      })
      const apiData = response.data?.data
      if (!apiData?.couriers) return []
      return apiData.couriers
    },
    enabled: !!token && !!destinationVillageCode && weight > 0,
    staleTime: 5 * 60 * 1000,
  })
}
