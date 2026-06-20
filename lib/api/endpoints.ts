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
    stockAlerts: "/users/me/stock-alerts",
  },
  upload: {
    file: "/files/upload",
  },
  orders: {
    list: "/orders",
    detail: (id: string) => `/orders/${id}` as const,
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
  cart: {
    root: "/cart",
    items: "/cart/items",
    item: (id: string) => `/cart/items/${id}` as const,
    savedItems: "/cart/saved-items",
    savedItem: (id: string) => `/cart/saved-items/${id}` as const,
    saveForLater: (itemId: string) =>
      `/cart/items/${itemId}/save-for-later` as const,
    moveToCart: (savedItemId: string) =>
      `/cart/saved-items/${savedItemId}/move-to-cart` as const,
  },
  productReviews: (slug: string) => `/products/${slug}/reviews` as const,
  relatedProducts: (slug: string) => `/products/${slug}/related` as const,
  myProductReview: (slug: string) => `/products/${slug}/reviews/me` as const,
  productStockAlert: (slug: string) => `/products/${slug}/stock-alerts` as const,
  flashSales: "/flash-sales",
  checkouts: {
    cart: "/checkouts/cart",
    directFlashSale: "/checkouts/direct-flash-sale",
    get: (id: string) => `/checkouts/${id}` as const,
  },
  payments: {
    get: (id: string) => `/payments/${id}` as const,
    checkoutSession: (id: string) =>
      `/payments/${id}/checkout-session` as const,
  },
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
