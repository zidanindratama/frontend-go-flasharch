import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type ApiEnvelope<T> = {
  message: string
  data: T
}

export type RegionalParams = {
  name?: string
  page?: number
  province_code?: string
  regency_code?: string
  district_code?: string
  village_code?: string
  postal_code?: string
  query?: string
  type?: string
}

export type ShippingCostParams = {
  destination_village_code: string
  weight: number
}

export async function getRegionalData<T>(
  endpoint: string,
  params?: RegionalParams,
) {
  const response = await api.get<ApiEnvelope<T>>(endpoint, { params })
  return response.data
}

export async function getShippingCost<T>(params: ShippingCostParams) {
  const response = await api.get<ApiEnvelope<T>>(endpoints.shipping.cost, {
    params,
  })
  return response.data
}
