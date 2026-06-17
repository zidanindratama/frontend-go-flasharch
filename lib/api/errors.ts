type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const axiosError = error as AxiosErrorResponse
    const message = axiosError.response?.data?.message
    if (typeof message === "string" && message.length > 0) {
      return message
    }
  }
  return fallback
}
