"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { TeachersDashboard } from "../../components/teachers/teachers-dashboard";

export default function TeacherPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <TeachersDashboard />
    </ProtectedRoute>
  );
}
