import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

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
      <div className="flex flex-1 overflow-hidden">
        {/* 2. Added flex & flex-col so height passes smoothly to the children */}
        <div className="bg-background flex w-1/3 min-w-[300px] flex-col overflow-hidden border-r">
          {middle}
        </div>
        <div className="bg-background flex flex-1 flex-col overflow-hidden">
          {right}
        </div>
      </div>
    </div>
  );
}
