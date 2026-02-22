import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Chat History | ContextGPT",
  description: "Review and manage your past chatbot conversations.",
};

export default function ChatHistoryLayout({ children, middle, right }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chat History" },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background w-1/3 min-w-[300px] border-r">
          {middle}
        </div>
        <div className="bg-background flex-1">{right}</div>
      </div>
    </div>
  );
}
