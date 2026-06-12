"use client"

import {
  type QueryKey,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/api/axios"

type MutationHookOptions<TData, TVariables, TContext> = {
  endpoint: string
  successMessage?: string
  errorMessage?: string
  invalidateKeys?: QueryKey[]
} & Omit<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  "mutationFn"
>

export function usePutData<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
>({
  endpoint,
  successMessage,
  errorMessage = "Failed to update data",
  invalidateKeys,
  onSuccess,
  onError,
  ...mutationOptions
}: MutationHookOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: async (variables) => {
      try {
        const response = await api.put<TData>(endpoint, variables)
        return response.data
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : errorMessage,
        )
      }
    },
    onSuccess: async (data, variables, context, mutationContext) => {
      if (successMessage) {
        const { toast } = await import("sonner")
        toast.success(successMessage)
      }

      if (invalidateKeys) {
        await Promise.all(
          invalidateKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        )
      }

      await onSuccess?.(data, variables, context, mutationContext)
    },
    onError: async (error, variables, context, mutationContext) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
      onError?.(error, variables, context, mutationContext)
    },
  })
}
