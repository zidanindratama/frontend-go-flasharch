import axios from "axios"
import { useAuthStore } from "@/stores/auth"
import { endpoints } from "@/lib/api/endpoints"

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1"

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === endpoints.auth.refresh
    ) {
      return Promise.reject(error)
    }

    const refresh_token = useAuthStore.getState().refresh_token
    if (!refresh_token) {
      useAuthStore.getState().clearAuth()
      return Promise.reject(error)
    }

    try {
      originalRequest._retry = true
      const response = await axios.post<{
        message: string
        data: { access_token: string; refresh_token: string }
      }>(`${baseURL}${endpoints.auth.refresh}`, { refresh_token })

      useAuthStore.getState().setAuth(response.data.data)
      originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`

      return api(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().clearAuth()
      return Promise.reject(refreshError)
    }
  },
)
