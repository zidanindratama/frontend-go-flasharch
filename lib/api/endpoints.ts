export const endpoints = {
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    signOut: "/auth/sign-out",
    refresh: "/auth/refresh-token",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
  },
  user: {
    me: "/users/me",
    uploadAvatar: "/users/me/avatar",
  },
} as const
