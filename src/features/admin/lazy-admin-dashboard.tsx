"use client";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () =>
    import(
      "@/features/admin/admin-dashboard"
    ).then(
      (module) =>
        module.AdminDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="glass-panel h-64 animate-pulse rounded-3xl border"
        aria-label="Loading admin dashboard"
      />
    ),
  },
);

export function LazyAdminDashboard() {
  return <AdminDashboard />;
}
