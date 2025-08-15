"use client";

import { ProtectedRoute } from "../components/protected-route";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Navigation initialView="library" />
    </ProtectedRoute>
  );
}
