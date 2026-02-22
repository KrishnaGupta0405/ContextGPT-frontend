import React from "react";
import { CustomResponsesProvider } from "./CustomResponsesProvider";
import HeaderClient from "./HeaderClient";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Custom Responses | ContextGPT",
  description: "Configure custom responses for your chatbot.",
};

export default function CustomResponsesLayout({ children, middle, right }) {
  return (
    <CustomResponsesProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <PanelNavbar
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Custom Responses" },
          ]}
        />
        <HeaderClient />
        {/* Main Split Layout */}
        <div className="flex h-full w-full flex-1 overflow-hidden">
          {/* Middle pane (List view) */}
          <div className="relative flex h-full w-[350px] min-w-[350px] flex-col overflow-hidden border-r bg-white">
            {middle}
          </div>
          {/* Right pane (Detail view) */}
          <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-50">
            {right}
          </div>
        </div>
      </div>
    </CustomResponsesProvider>
  );
}
