import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Website Links | ContextGPT",
  description:
    "Crawl and manage website links for your chatbot knowledge base.",
};

const WebsiteLinks = () => {
  return (
    <div className="flex h-full flex-col">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Website Links" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Website Links</h2>
        </div>
        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500 italic">
          Website Links content goes here.
        </div>
      </div>
    </div>
  );
};

export default WebsiteLinks;
