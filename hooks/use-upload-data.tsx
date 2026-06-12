"use client"

import {
  type QueryKey,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/api/axios"

type UploadHookOptions<TData, TContext> = {
  endpoint: string
  successMessage?: string
  errorMessage?: string
  invalidateKeys?: QueryKey[]
} & Omit<
  UseMutationOptions<TData, Error, FormData, TContext>,
  "mutationFn"
>

export function useUploadData<TData = unknown, TContext = unknown>({
  endpoint,
  successMessage,
  errorMessage = "Failed to upload file",
  invalidateKeys,
  onSuccess,
  onError,
  ...mutationOptions
}: UploadHookOptions<TData, TContext>) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, FormData, TContext>({
    ...mutationOptions,
    mutationFn: async (formData) => {
      try {
        const response = await api.post<TData>(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
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
