import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { ResizableLayout } from "./ResizableLayout";

export const metadata = {
  title: "Chat History | ContextGPT",
  description: "Review and manage your past chatbot conversations.",
};

export default function ChatHistoryLayout({ children, middle, right }) {
  return (
    // 1. Changed h-full to h-[100dvh] to strictly lock to the viewport height
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chat History" },
        ]}
      />
      <ResizableLayout middle={middle} right={right} />
    </div>
  );
}
