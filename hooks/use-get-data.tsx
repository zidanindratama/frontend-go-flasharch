"use client"

import {
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query"
import { api } from "@/lib/api/axios"

type UseGetDataOptions<TQueryFnData, TData = TQueryFnData> = {
  queryKey: QueryKey
  endpoint: string
  params?: Record<string, unknown>
  errorMessage?: string
} & Omit<
  UseQueryOptions<TQueryFnData, Error, TData, QueryKey>,
  "queryKey" | "queryFn"
>

export function useGetData<TQueryFnData = unknown, TData = TQueryFnData>({
  queryKey,
  endpoint,
  params,
  errorMessage = "Failed to fetch data",
  ...queryOptions
}: UseGetDataOptions<TQueryFnData, TData>) {
  return useQuery<TQueryFnData, Error, TData, QueryKey>({
    ...queryOptions,
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.get<TQueryFnData>(endpoint, { params })
        return response.data
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : errorMessage,
        )
      }
    },
  })
}
