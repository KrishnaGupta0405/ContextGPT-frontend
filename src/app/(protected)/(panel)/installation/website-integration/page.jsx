import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export const metadata = {
  title: "Website Integration | Installation | ContextGPT",
  description: "Learn how to integrate ContextGPT chatbot into your website.",
};

const website_integration = () => {
  return (
    <div className="flex h-full flex-col">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Installation" },
          { label: "Website Integration" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Website Integration
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className={`flex h-20 w-full items-center justify-center rounded-lg text-xl font-bold text-white ${
                index % 5 === 0 ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              Step {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default website_integration;
