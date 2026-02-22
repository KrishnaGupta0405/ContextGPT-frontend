import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Files Sources | ContextGPT",
  description:
    "Upload and manage document sources for your chatbot knowledge base.",
};

const FileSources = () => {
  return (
    <div className="flex h-full flex-col">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Files Sources" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Files Sources</h2>
        </div>
        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500 italic">
          File Sources content goes here.
        </div>
      </div>
    </div>
  );
};

export default FileSources;
