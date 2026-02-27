import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Auto Sync | ContextGPT",
  description: "View your chatbot performance analytics and overview.",
};

export default function AutoSync() {
  return (
    <>
      <PanelNavbar items={[{ label: "Dashboard" }]} />
      <div className="h-full flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Auto Sync</h2>
        </div>
        <div>
          <h3 className="mt-8 text-lg font-medium text-slate-500 italic">
            Auto Sync h ye bro !!
          </h3>
        </div>
      </div>
    </>
  );
}
