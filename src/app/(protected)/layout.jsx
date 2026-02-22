"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { ChatbotProvider } from "@/context/ChatbotContext";

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <ChatbotProvider>{children}</ChatbotProvider>
    </AuthGuard>
  );
}
