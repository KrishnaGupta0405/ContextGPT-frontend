import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

export const metadata = {
  title: "Dashboard | ContextGPT",
  description: "View your chatbot performance analytics and overview.",
};

export default function Dashboard() {
  return (
    <div className="h-full flex-1 space-y-4 p-4 pt-6 md:p-8">
      <CustomBreadcrumb items={[{ label: "Dashboard" }]} className="mb-4" />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div>
        <h3 className="mt-8 text-lg font-medium text-slate-500 italic">
          Dashboard h ye bhadwe !!
        </h3>
      </div>
    </div>
  );
}
