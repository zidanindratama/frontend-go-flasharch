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
  products: "/products",
  categories: "/categories",
  blogs: "/blogs",
  blogCategories: "/blog-categories",
  regional: {
    provinces: "/regional/provinces",
    province: (code: string) => `/regional/provinces/${code}` as const,
    provinceRegencies: (code: string) =>
      `/regional/provinces/${code}/regencies` as const,
    regencies: "/regional/regencies",
    regency: (code: string) => `/regional/regencies/${code}` as const,
    regencyDistricts: (code: string) =>
      `/regional/regencies/${code}/districts` as const,
    districts: "/regional/districts",
    district: (code: string) => `/regional/districts/${code}` as const,
    districtVillages: (code: string) =>
      `/regional/districts/${code}/villages` as const,
    villages: "/regional/villages",
    village: (code: string) => `/regional/villages/${code}` as const,
    postalCodes: "/regional/postal-codes",
    postalCode: (postalCode: string) =>
      `/regional/postal-codes/${postalCode}` as const,
    search: "/regional/search",
  },
  shipping: {
    cost: "/shipping/cost",
  },
  productReviews: (slug: string) => `/products/${slug}/reviews` as const,
  flashSales: "/flash-sales",
  admin: {
    dashboard: "/admin/reports/dashboard",
    summary: "/admin/reports/summary",
    orders: "/admin/orders",
    reportsProducts: "/admin/reports/products",
    users: "/admin/users",
    products: "/admin/products",
    categories: "/admin/categories",
    inventory: {
      stocks: "/admin/inventory/stocks",
      movements: "/admin/inventory/movements",
    },
    stockAdjust: (productId: string) =>
      `/admin/products/${productId}/stock-adjustments` as const,
    blogs: "/admin/blogs",
    blogCategories: "/admin/blog-categories",
    flashSales: "/admin/flash-sales",
  },
} as const
