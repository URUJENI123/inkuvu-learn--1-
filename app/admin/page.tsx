"use client";

import { ProtectedRoute } from "../../components/protected-route";
import { AdminDashboard } from "../../components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
}
