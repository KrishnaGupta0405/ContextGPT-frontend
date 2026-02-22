import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

export default function AppearanceLayout({ children, middle, right }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Appearance" },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background w-2/3 min-w-[300px] border-r">
          {middle}
        </div>
        <div className="bg-background flex-1">{right}</div>
      </div>
    </div>
  );
}
