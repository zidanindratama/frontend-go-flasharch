import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/lib/api/user"
import { setCookie, deleteCookie } from "@/lib/cookies"

type AuthState = {
  access_token: string | null
  refresh_token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (tokens: { access_token: string; refresh_token: string }) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (tokens) => {
        setCookie("gfa-auth", "true")
        set({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          user: null,
          isAuthenticated: true,
        })
      },
      setUser: (user) => {
        setCookie("gfa-role", user.role.code)
        set({ user, isLoading: false })
      },
      clearAuth: () => {
        deleteCookie("gfa-auth")
        deleteCookie("gfa-role")
        set({
          access_token: null,
          refresh_token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "gfa-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
    },
  ),
)
