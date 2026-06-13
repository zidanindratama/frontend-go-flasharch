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
    dashboard: "/users/me/dashboard",
    addresses: "/users/me/addresses",
    wishlist: "/users/me/wishlist",
  },
  upload: {
    file: "/files/upload",
  },
  orders: {
    list: "/orders",
  },
  admin: {
    dashboard: "/admin/reports/dashboard",
    summary: "/admin/reports/summary",
    orders: "/admin/orders",
    reportsProducts: "/admin/reports/products",
    users: "/admin/users",
    products: "/admin/products",
    categories: "/admin/categories",
  },
} as const
