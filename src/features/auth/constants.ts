export const AUTH_STORAGE_KEYS = {
  session: "shopsphere.auth.session",
  users: "shopsphere.auth.users",
} as const;

export const AUTH_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  orders: "/orders",
  checkout: "/checkout",
  admin: "/admin",
} as const;

export const PROTECTED_ROUTES = [
  AUTH_ROUTES.dashboard,
  AUTH_ROUTES.orders,
  AUTH_ROUTES.checkout,
  AUTH_ROUTES.admin,
] as const;
