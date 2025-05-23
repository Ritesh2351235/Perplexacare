"use client";

import { Assistant } from "@/app/assistant";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Assistant />
    </ProtectedRoute>
  );
} 